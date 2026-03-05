/**
 * API Configuration and Endpoints
 */

/**
 * API endpoint paths
 * Centralized for easy maintenance and updates
 */
export const API_ENDPOINTS = {
  CHECKOUT: '/api/checkout',
  WAITLIST: '/api/waitlist',
};

/**
 * Default request headers for JSON API calls
 * @type {Object}
 */
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

/**
 * Checkout request configuration
 */
export const CHECKOUT_CONFIG = {
  method: 'POST',
  headers: DEFAULT_HEADERS,
};

/**
 * Waitlist request configuration
 */
export const WAITLIST_CONFIG = {
  method: 'POST',
  headers: DEFAULT_HEADERS,
};

/**
 * Default shipping configuration for checkout
 * Align with your Stripe configuration
 */
export const DEFAULT_SHIPPING_RATE = undefined; // Uses API default
