/**
 * CustomRequestService
 * Business logic for custom order requests
 * Handles creation, email notifications, and workflow
 */

import { Resend } from 'resend';
import { CustomRequest, CustomRequestInput } from '@api/types';
import { CustomRequestRepository } from '@api/repositories/CustomRequestRepository';
import { getConfig } from '@api/config';
import { logger } from '@api/utils/logger';

export class CustomRequestService {
  private repository: CustomRequestRepository;
  private resend: Resend;
  private adminEmail = 'hello@kyndodesign.com'; // Change to actual admin email

  constructor() {
    this.repository = new CustomRequestRepository();
    const config = getConfig();
    this.resend = new Resend(config.RESEND_API_KEY);
  }

  async submitCustomRequest(request: CustomRequestInput): Promise<CustomRequest> {
    logger.info('Processing custom request', {
      email: request.email,
      name: request.name,
    });

    // Create request in database
    const customRequest = await this.repository.create({
      name: request.name,
      email: request.email,
      phone: request.phone,
      product: request.product,
      dimensions: request.dimensions,
      colours: request.colours,
      context: request.context,
      references: request.references,
      budget: request.budget,
      deadline: request.deadline,
      message: request.message,
    });

    // Send confirmation email to customer
    await this.sendCustomerConfirmation(request);

    // Send notification to admin
    await this.sendAdminNotification(customRequest, request);

    logger.info('Custom request submitted', {
      id: customRequest.id,
      email: request.email,
    });

    return customRequest;
  }

  private async sendCustomerConfirmation(request: CustomRequestInput): Promise<void> {
    try {
      await this.resend.emails.send({
        from: 'Kyndo <hello@kyndodesign.com>',
        to: request.email,
        subject: 'Thank you for your custom request',
        html: `
          <div style="font-family: Fenix, Georgia, serif; color:#111">
            <h2 style="margin:0 0 12px">Thank you for reaching out</h2>
            <p style="margin:0 0 16px">We received your custom request and will review it carefully. We'll be in touch soon to discuss your project.</p>
            <p style="margin:0; color:#666; font-size:14px">— Kyndo Studio</p>
          </div>
        `,
      });
    } catch (error) {
      logger.error('Failed to send customer confirmation', error instanceof Error ? error : undefined, {
        email: request.email,
      });
    }
  }

  private async sendAdminNotification(customRequest: CustomRequest, request: CustomRequestInput): Promise<void> {
    try {
      const detailsHtml = `
        <p><strong>Name:</strong> ${request.name}</p>
        <p><strong>Email:</strong> ${request.email}</p>
        ${request.phone ? `<p><strong>Phone:</strong> ${request.phone}</p>` : ''}
        ${request.product ? `<p><strong>Product:</strong> ${request.product}</p>` : ''}
        ${request.dimensions ? `<p><strong>Dimensions:</strong> ${request.dimensions}</p>` : ''}
        ${request.colours ? `<p><strong>Colours:</strong> ${request.colours}</p>` : ''}
        ${request.context ? `<p><strong>Context:</strong> ${request.context}</p>` : ''}
        ${request.references ? `<p><strong>References:</strong> ${request.references}</p>` : ''}
        ${request.budget ? `<p><strong>Budget:</strong> ${request.budget}</p>` : ''}
        ${request.deadline ? `<p><strong>Deadline:</strong> ${request.deadline}</p>` : ''}
        ${request.message ? `<p><strong>Message:</strong> ${request.message}</p>` : ''}
      `;

      await this.resend.emails.send({
        from: 'Kyndo <hello@kyndodesign.com>',
        to: this.adminEmail,
        subject: `New Custom Request: ${request.name}`,
        html: `
          <h2>New Custom Request Submission</h2>
          ${detailsHtml}
          <p><strong>Request ID:</strong> ${customRequest.id}</p>
          <p><strong>Submitted:</strong> ${customRequest.created_at}</p>
        `,
      });
    } catch (error) {
      logger.error('Failed to send admin notification', error instanceof Error ? error : undefined);
    }
  }
}
