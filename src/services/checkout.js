/**
 * Checkout Service
 * Handles communication with checkout API
 */

import { API_ENDPOINTS, CHECKOUT_CONFIG, DEFAULT_SHIPPING_RATE } from '../constants/api.js';

/**
 * Initiates checkout process with Stripe
 * Redirects to Stripe Checkout if successful
 *
 * @param {Array} items - Cart items to checkout
 * @returns {Promise<void>}
 * @throws {Error} If checkout fails
 */
export async function initiateCheckout(items) {
  if (!items || items.length === 0) {
    throw new Error('Cart is empty');
  }

  const payload = {
    items: items.map((item) => ({
      cable: item.cable || 'standard',
      qty: item.qty || 1,
    })),
    shippingRate: DEFAULT_SHIPPING_RATE,
  };

  const response = await fetch(API_ENDPOINTS.CHECKOUT, {
    ...CHECKOUT_CONFIG,
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok || !data?.url) {
    const errorMessage = data?.error || 'Checkout failed. Please try again.';
    throw new Error(errorMessage);
  }

  // Redirect to Stripe Checkout
  window.location = data.url;
}
