interface ApiEndpoints {
  CHECKOUT: string;
  WAITLIST: string;
}

interface RequestConfig {
  method: string;
  headers: {
    'Content-Type': string;
  };
}

export const API_ENDPOINTS: ApiEndpoints = {
  CHECKOUT: '/api/checkout',
  WAITLIST: '/api/waitlist',
};

export const DEFAULT_HEADERS: RequestConfig['headers'] = {
  'Content-Type': 'application/json',
};

export const CHECKOUT_CONFIG: RequestConfig = {
  method: 'POST',
  headers: DEFAULT_HEADERS,
};

export const WAITLIST_CONFIG: RequestConfig = {
  method: 'POST',
  headers: DEFAULT_HEADERS,
};

export const DEFAULT_SHIPPING_RATE: undefined = undefined;
