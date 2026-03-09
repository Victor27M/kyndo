/**
 * WaitlistService
 * Business logic layer for waitlist operations
 * Orchestrates repository calls and sends emails
 */

import { Resend } from 'resend';
import { Waitlist, WaitlistRequest } from '@api/types';
import { WaitlistRepository } from '@api/repositories/WaitlistRepository';
import { getConfig } from '@api/config';
import { logger } from '@api/utils/logger';
import { ValidationError, InternalError } from '@api/errors/AppError';

export class WaitlistService {
  private repository: WaitlistRepository;
  private resend: Resend;

  constructor() {
    this.repository = new WaitlistRepository();
    const config = getConfig();
    this.resend = new Resend(config.RESEND_API_KEY);
  }

  async subscribeToWaitlist(request: WaitlistRequest): Promise<Waitlist> {
    logger.info('Processing waitlist subscription', {
      email: request.email,
      page: request.page,
    });

    // Create or update waitlist entry
    const entry = await this.repository.create({
      email: request.email,
      page: request.page,
    });

    // Send confirmation email to subscriber
    await this.sendConfirmationEmail(request.email);

    // Send notification to admin
    await this.sendAdminNotification(request);

    logger.info('Waitlist subscription completed', { email: request.email, id: entry.id });

    return entry;
  }

  private async sendConfirmationEmail(email: string): Promise<void> {
    try {
      await this.resend.emails.send({
        from: 'Kyndo <hello@kyndodesign.com>',
        to: email,
        subject: "You're on the Kyndo waitlist ✨",
        html: `
          <div style="font-family: Fenix, Georgia, serif; color:#111">
            <h2 style="margin:0 0 12px">Thanks for joining the waitlist</h2>
            <p style="margin:0 0 16px">We'll email you as soon as there's something new.</p>
            <p style="margin:0; color:#666; font-size:14px">— Kyndo Studio</p>
          </div>
        `,
      });
    } catch (error) {
      logger.error('Failed to send confirmation email', error instanceof Error ? error : undefined, {
        email,
      });
      // Don't throw - email failure shouldn't block subscription
    }
  }

  private async sendAdminNotification(request: WaitlistRequest): Promise<void> {
    try {
      await this.resend.emails.send({
        from: 'Kyndo <hello@kyndodesign.com>',
        to: 'hello@kyndodesign.com', // Change to actual admin email
        subject: `New Waitlist Subscription: ${request.email}`,
        html: `
          <p>Email: ${request.email}</p>
          <p>Page: ${request.page || 'Not specified'}</p>
          <p>Time: ${new Date().toISOString()}</p>
        `,
      });
    } catch (error) {
      logger.error('Failed to send admin notification', error instanceof Error ? error : undefined);
      // Don't throw - email failure shouldn't block subscription
    }
  }
}
