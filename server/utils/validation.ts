/**
 * Request Validation Schemas
 * Zod schemas for runtime validation of all request bodies and params
 * Provides both type safety and runtime checks
 */

import { z } from 'zod';

/**
 * Waitlist endpoint validation
 */
export const WaitlistRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
  page: z.string().optional(),
});

export type WaitlistRequestPayload = z.infer<typeof WaitlistRequestSchema>;

/**
 * Custom request endpoint validation
 */
export const CustomRequestSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  product: z.string().optional(),
  dimensions: z.string().optional(),
  colours: z.string().optional(),
  context: z.string().optional(),
  references: z.string().optional(),
  budget: z.string().optional(),
  deadline: z.string().optional(),
  message: z.string().optional(),
});

export type CustomRequestPayload = z.infer<typeof CustomRequestSchema>;

/**
 * Checkout request validation
 */
export const CheckoutItemSchema = z.object({
  qty: z.number().int().min(1).default(1),
  cable: z.enum(['standard', 'premium']).default('standard'),
});

export const CheckoutRequestSchema = z.object({
  items: z.array(CheckoutItemSchema).min(1, 'Cart must have at least one item'),
  shippingRate: z.string().optional(),
});

export type CheckoutRequestPayload = z.infer<typeof CheckoutRequestSchema>;

/**
 * Validation helper function
 */
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    const formattedErrors = result.error.flatten();
    throw new Error(
      `Validation failed: ${JSON.stringify(formattedErrors.fieldErrors)}`
    );
  }

  return result.data;
}
