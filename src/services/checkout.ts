import { API_ENDPOINTS, CHECKOUT_CONFIG, DEFAULT_SHIPPING_RATE } from '@/constants/api';
import type { CartItem } from '@/types';

interface CheckoutPayload {
  items: Array<{
    cable: string;
    qty: number;
  }>;
  shippingRate: undefined;
}

interface CheckoutResponse {
  url?: string;
  error?: string;
}

export async function initiateCheckout(items: CartItem[]): Promise<void> {
  if (!items || items.length === 0) {
    throw new Error('Cart is empty');
  }

  const payload: CheckoutPayload = {
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

  const data = (await response.json()) as CheckoutResponse;

  if (!response.ok || !data?.url) {
    const errorMessage = data?.error || 'Checkout failed. Please try again.';
    throw new Error(errorMessage);
  }

  window.location.href = data.url;
}
