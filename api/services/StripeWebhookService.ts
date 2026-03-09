/**
 * StripeWebhookService
 * Business logic for processing Stripe webhook events
 * Handles order creation, email notifications, Discord notifications
 */

import Stripe from 'stripe';
import { Resend } from 'resend';
import { Order, OrderItem, OrderAddress } from '@api/types';
import { OrderRepository } from '@api/repositories/OrderRepository';
import { getConfig } from '@api/config';
import { logger } from '@api/utils/logger';

export class StripeWebhookService {
  private stripe: Stripe;
  private resend: Resend;
  private repository: OrderRepository;
  private adminEmail = 'hello@kyndodesign.com'; // Change to actual admin email

  constructor() {
    const config = getConfig();
    this.stripe = new Stripe(config.STRIPE_SECRET_KEY);
    this.resend = new Resend(config.RESEND_API_KEY);
    this.repository = new OrderRepository();
  }

  async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session): Promise<void> {
    logger.info('Processing checkout completion', { sessionId: session.id });

    try {
      // Fetch line items from Stripe
      const lineItems = await this.fetchLineItems(session.id);

      // Build order payload
      const order = this.buildOrderPayload(session, lineItems);

      // Save to database
      const savedOrder = await this.repository.findOrCreateByStripeId(session.id, order);

      // Send customer confirmation email
      if (savedOrder.email && !savedOrder.customer_emailed) {
        await this.sendCustomerEmail(savedOrder);
        await this.repository.updateCustomerNotified(savedOrder.id);
      }

      // Send admin notifications (email + Discord)
      if (!savedOrder.owner_notified) {
        await Promise.all([
          this.sendAdminEmail(savedOrder),
          this.sendDiscordNotification(savedOrder),
        ]);
        await this.repository.updateOwnerNotified(savedOrder.id);
      }

      logger.info('Checkout processed successfully', { orderId: savedOrder.id });
    } catch (error) {
      logger.error('Error processing checkout', error instanceof Error ? error : undefined);
      throw error;
    }
  }

  private async fetchLineItems(sessionId: string): Promise<Stripe.LineItem[]> {
    const response = await this.stripe.checkout.sessions.listLineItems(sessionId, { limit: 100 });
    return response.data;
  }

  private buildOrderPayload(session: Stripe.Checkout.Session, lineItems: Stripe.LineItem[]): Omit<Order, 'id'> {
    const items = lineItems.map((item) => ({
      name: item.description || 'Unknown Item',
      qty: item.quantity || 1,
      unit_amount: (item.amount_subtotal ?? 0) / 100,
      subtotal: (item.amount_subtotal ?? 0) / 100,
    }));

    const currency = (session.currency || 'ron').toUpperCase();
    const displayId = this.makeDisplayId(session.id);

    // Convert Stripe address (with null values) to OrderAddress (with undefined)
    const stripeAddress = session.customer_details?.address;
    const address = stripeAddress ? {
      line1: stripeAddress.line1 ?? undefined,
      line2: stripeAddress.line2 ?? undefined,
      postal_code: stripeAddress.postal_code ?? undefined,
      city: stripeAddress.city ?? undefined,
      state: stripeAddress.state ?? undefined,
      country: stripeAddress.country ?? undefined,
    } : undefined;

    return {
      stripe_id: session.id,
      display_id: displayId,
      status: 'paid',
      email: session.customer_details?.email ?? undefined,
      name: session.customer_details?.name ?? undefined,
      phone: session.customer_details?.phone ?? undefined,
      address,
      currency,
      amount_total: (session.amount_total ?? 0) / 100,
      items,
      owner_notified: false,
      customer_emailed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  private async sendCustomerEmail(order: Order): Promise<void> {
    try {
      const { currency, amount_total, display_id, email, items, address, phone, name } = order;

      const itemsHtml = this.renderItemsHtml(items, currency);
      const addressHtml = this.renderAddress(address);

      await this.resend.emails.send({
        from: 'Kyndo <hello@kyndodesign.com>',
        to: email!,
        subject: `Mulțumim! Comanda ta ${display_id} a fost primită`,
        html: `
          <div style="font-family: Fenix, Georgia, serif; color:#111; max-width:640px; margin:0 auto;">
            <h2 style="margin:0 0 8px;">Mulțumim pentru comandă!</h2>
            <p style="margin:0 0 12px;">Comanda <strong>${display_id}</strong> a fost înregistrată.</p>

            <h3 style="margin:18px 0 8px;">Sumar comandă</h3>
            ${itemsHtml}
            <p style="margin:12px 0;"><strong>Total:</strong> ${amount_total.toFixed(2)} ${currency}</p>

            <h3 style="margin:18px 0 8px;">Livrare</h3>
            <p style="margin:0 0 6px;">${addressHtml}</p>
            ${phone ? `<p style="margin:0 0 6px;"><strong>Telefon:</strong> ${phone}</p>` : ''}

            <p style="margin:18px 0 0;">Te anunțăm când expediem coletul. Dacă ai întrebări, răspunde la acest email.</p>
            <p style="margin:6px 0 0; color:#666; font-size:14px;">— Kyndo Studio</p>
          </div>
        `,
      });

      logger.info('Customer email sent', { orderId: order.id, email });
    } catch (error) {
      logger.error('Failed to send customer email', error instanceof Error ? error : undefined);
    }
  }

  private async sendAdminEmail(order: Order): Promise<void> {
    try {
      const { display_id, email, name, phone, address, currency, amount_total, items } = order;
      const itemsHtml = this.renderItemsHtml(items, currency);
      const addressHtml = this.renderAddress(address);

      await this.resend.emails.send({
        from: 'Kyndo <hello@kyndodesign.com>',
        to: this.adminEmail,
        subject: `New Order: ${display_id}`,
        html: `
          <h2>Order ${display_id}</h2>
          <p><strong>Customer:</strong> ${name} (${email})</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          <h3>Items</h3>
          ${itemsHtml}
          <p><strong>Total:</strong> ${amount_total.toFixed(2)} ${currency}</p>
          <h3>Shipping Address</h3>
          <p>${addressHtml}</p>
        `,
      });

      logger.info('Admin email sent', { orderId: order.id });
    } catch (error) {
      logger.error('Failed to send admin email', error instanceof Error ? error : undefined);
    }
  }

  private async sendDiscordNotification(order: Order): Promise<void> {
    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!discordWebhookUrl) {
      logger.info('Discord notification skipped - no webhook URL');
      return;
    }

    try {
      const { display_id, name, email, phone, address, currency, amount_total, items, stripe_id } = order;

      const itemsText = items.map((i) => `• ${i.name} ×${i.qty} — ${i.unit_amount.toFixed(2)} ${currency}`).join('\n') || '—';
      const addressText = this.formatAddressText(address);
      const ownerTag = process.env.DISCORD_OWNER_TAG || '';

      const response = await fetch(discordWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'Kyndo Bot',
          content: ownerTag,
          embeds: [
            {
              title: `🧾 New order ${display_id}`,
              color: 5814783,
              fields: [
                {
                  name: 'Customer',
                  value: `${name || '—'}\n${email || '—'}\n${phone || '—'}`,
                  inline: false,
                },
                { name: 'Address', value: addressText, inline: false },
                { name: 'Items', value: itemsText, inline: false },
                { name: 'Total', value: `${amount_total.toFixed(2)} ${currency}`, inline: true },
                { name: 'Currency', value: currency, inline: true },
                { name: 'Stripe', value: `Session: ${stripe_id}`, inline: false },
              ],
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Discord webhook failed: ${text}`);
      }

      logger.info('Discord notification sent', { orderId: order.id });
    } catch (error) {
      logger.error('Failed to send Discord notification', error instanceof Error ? error : undefined);
    }
  }

  private makeDisplayId(stripeId: string): string {
    return `KY-${stripeId.slice(-6).toUpperCase()}`;
  }

  private renderAddress(addr?: OrderAddress): string {
    if (!addr) return '—';
    return [addr.line1, addr.line2, [addr.postal_code, addr.city].filter(Boolean).join(' '), addr.state, addr.country]
      .filter(Boolean)
      .join('<br/>');
  }

  private formatAddressText(addr?: OrderAddress): string {
    if (!addr) return '—';
    return [addr.line1, addr.line2, [addr.postal_code, addr.city].filter(Boolean).join(' '), addr.state, addr.country]
      .filter(Boolean)
      .join(', ');
  }

  private renderItemsHtml(items: OrderItem[], currency: string): string {
    if (!items || items.length === 0) return '<p>—</p>';

    const rows = items
      .map(
        (i) =>
          `
      <tr>
        <td style="padding:6px 8px;border-bottom:1px solid #eee;">${i.name}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #eee;" align="right">x${i.qty}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #eee;" align="right">${i.unit_amount.toFixed(2)} ${currency}</td>
      </tr>`
      )
      .join('');

    return `
    <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
      <thead>
        <tr>
          <th align="left" style="text-align:left;padding:6px 8px;border-bottom:1px solid #eee;">Item</th>
          <th align="right" style="text-align:right;padding:6px 8px;border-bottom:1px solid #eee;">Qty</th>
          <th align="right" style="text-align:right;padding:6px 8px;border-bottom:1px solid #eee;">Unit</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
  }
}
