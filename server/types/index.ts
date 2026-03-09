/**
 * API Response Types
 * Defines typed response envelopes for all API endpoints
 */

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_ERROR = 500,
}

export interface ApiSuccess<T> {
  data: T;
  message: string;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiErrorResponse;

/**
 * Waitlist domain types
 */
export interface WaitlistRequest {
  email: string;
  page?: string;
}

export interface Waitlist {
  id: string;
  email: string;
  page?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Custom Request domain types
 */
export interface CustomRequestInput {
  name: string;
  email: string;
  phone?: string;
  product?: string;
  dimensions?: string;
  colours?: string;
  context?: string;
  references?: string;
  budget?: string;
  deadline?: string;
  message?: string;
}

export interface CustomRequest extends CustomRequestInput {
  id: string;
  status: CustomRequestStatus;
  created_at: string;
  updated_at: string;
}

export enum CustomRequestStatus {
  NEW = 'new',
  IN_REVIEW = 'in_review',
  QUOTED = 'quoted',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  IN_PRODUCTION = 'in_production',
  COMPLETED = 'completed',
}

/**
 * Checkout domain types
 */
export interface CheckoutItem {
  qty: number;
  cable: 'standard' | 'premium';
}

export interface CheckoutRequest {
  items: CheckoutItem[];
  shippingRate?: string;
}

export interface StripeCheckoutResponse {
  url: string;
}

/**
 * Order domain types (from Stripe webhook)
 */
export interface OrderAddress {
  line1?: string;
  line2?: string;
  postal_code?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface OrderItem {
  name: string;
  qty: number;
  unit_amount: number;
  subtotal: number;
}

export interface Order {
  id: string;
  stripe_id: string;
  display_id: string;
  status: 'paid' | 'pending' | 'cancelled';
  email?: string;
  name?: string;
  phone?: string;
  address?: OrderAddress;
  currency: string;
  amount_total: number;
  items: OrderItem[];
  owner_notified: boolean;
  customer_emailed: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Generic Repository interface
 */
export interface IRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(data: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}
