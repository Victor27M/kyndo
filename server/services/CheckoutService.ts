/**
 * CheckoutService
 * Business logic for Stripe checkout sessions
 * Handles pricing, shipping, and session creation
 */

import Stripe from 'stripe';
import { CheckoutRequest, CheckoutItem, StripeCheckoutResponse } from '@api/types';
import { getConfig } from '@api/config';
import { logger } from '@api/utils/logger';
import { InternalError } from '@api/errors/AppError';

export class CheckoutService {
  private stripe: Stripe;
  private readonly CURRENCY = 'ron';
  private readonly SHIPPING_COUNTRIES = [
    'US',
    'CA',
    'MX',
    'AR',
    'BR',
    'CL',
    'CO',
    'PE',
    'UY',
    'GB',
    'IE',
    'FR',
    'DE',
    'IT',
    'ES',
    'PT',
    'NL',
    'BE',
    'LU',
    'AT',
    'CH',
    'DK',
    'SE',
    'NO',
    'FI',
    'IS',
    'PL',
    'CZ',
    'SK',
    'HU',
    'SI',
    'HR',
    'RO',
    'BG',
    'GR',
    'EE',
    'LV',
    'LT',
    'MT',
    'CY',
    'TR',
    'IL',
    'AE',
    'SA',
    'QA',
    'KW',
    'BH',
    'OM',
    'JO',
    'EG',
    'MA',
    'TN',
    'ZA',
    'AU',
    'NZ',
    'JP',
    'KR',
    'SG',
    'HK',
    'TW',
    'TH',
    'VN',
    'MY',
    'ID',
    'PH',
    'IN',
  ] as const;

  // Pricing from products.js
  private readonly PRICE_STANDARD = 17999; // 179.99 in cents
  private readonly PRICE_PREMIUM = 25999; // 259.99 in cents

  constructor() {
    const config = getConfig();
    this.stripe = new Stripe(config.STRIPE_SECRET_KEY);
  }

  async createCheckoutSession(
    request: CheckoutRequest,
    origin: string
  ): Promise<StripeCheckoutResponse> {
    logger.info('Creating checkout session', {
      itemCount: request.items.length,
      origin,
    });

    // Validate shippingRate
    const shippingRate = request.shippingRate || process.env.STRIPE_SHIPPING_RATE_EASYBOX;
    if (!shippingRate) {
      throw new InternalError('Shipping rate configuration missing');
    }

    // Build line items from cart
    const lineItems = this.buildLineItems(request.items);

    // Create Stripe session
    try {
      const session = await this.stripe.checkout.sessions.create({
        mode: 'payment',
        locale: 'ro',
        phone_number_collection: { enabled: true },
        billing_address_collection: 'auto',
        shipping_address_collection: {
          allowed_countries: [...this.SHIPPING_COUNTRIES],
        },
        shipping_options: [{ shipping_rate: shippingRate }],
        line_items: lineItems,
        allow_promotion_codes: false,
        custom_text: {
          submit: { message: 'Plată securizată 🔒' },
        },
        success_url: `${origin}/?success=1&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/cart?canceled=1`,
      });

      if (!session.url) {
        throw new InternalError('Failed to generate checkout URL');
      }

      logger.info('Checkout session created', {
        sessionId: session.id,
      });

      return { url: session.url };
    } catch (error) {
      logger.error('Stripe session creation failed', error instanceof Error ? error : undefined);
      throw new InternalError(
        error instanceof Error ? error.message : 'Failed to create checkout session'
      );
    }
  }

  private buildLineItems(items: CheckoutItem[]): Stripe.Checkout.SessionCreateParams.LineItem[] {
    return items.map((item) => {
      const isPremium = item.cable === 'premium';
      const unitAmount = isPremium ? this.PRICE_PREMIUM : this.PRICE_STANDARD;
      const productName = isPremium ? 'Nemuri Lamp — Premium' : 'Nemuri Lamp — Standard';

      return {
        quantity: item.qty,
        price_data: {
          currency: this.CURRENCY,
          unit_amount: unitAmount,
          product_data: {
            name: productName,
            metadata: {
              base: 'Nemuri Lamp',
              cable: item.cable,
            },
          },
        },
      };
    });
  }
}
