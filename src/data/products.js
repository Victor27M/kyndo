/**
 * Product Configuration
 * Central repository for all product definitions, variants, and options
 */

import lampBlue from '../assets/parts/lamp-blue.jpg';
import lampGraphite from '../assets/parts/lamp-graphite.jpg';
import lampSand from '../assets/parts/lamp-sand.jpg';
import lampRed from '../assets/parts/lamp-red.jpg';

/**
 * Cable options for customization
 * @type {Array<{key: string, label: string, desc: string}>}
 */
export const CABLE_OPTIONS = [
  {
    key: 'standard',
    label: 'Standard',
    desc: 'Durable PVC cable • clean, minimalist look • 1.8 m',
  },
  {
    key: 'premium',
    label: 'Premium',
    desc: 'Braided textile cable • softer touch • 1.8 m',
  },
];

/**
 * Color variants with swatches and images
 * @type {Array<{key: string, label: string, swatch: string, image: string}>}
 */
export const COLOR_VARIANTS = [
  { key: 'blue', label: 'Blue', swatch: '#2358C5', image: lampBlue },
  { key: 'graphite', label: 'Graphite', swatch: '#2b2b2b', image: lampGraphite },
  { key: 'sand', label: 'Sand', swatch: '#d8c9ae', image: lampSand },
  { key: 'red', label: 'Red', swatch: '#b74a3c', image: lampRed },
];

/**
 * Price configuration by cable type
 * @type {Object<string, number>}
 */
export const PRICING = {
  standard: 149.99,
  premium: 199.99,
};

/**
 * Catalog products
 * @type {Array<{id: number, name: string, price: number, image: string}>}
 */
export const CATALOG_PRODUCTS = [
  { id: 1, name: 'Nemuri Lamp', price: 149.99, image: lampBlue },
  { id: 2, name: 'Nemuri Lamp', price: 149.99, image: lampGraphite },
  { id: 3, name: 'Nemuri Lamp', price: 149.99, image: lampSand },
  { id: 4, name: 'Nemuri Lamp', price: 149.99, image: lampRed },
  { id: 5, name: 'Nemuri Lamp', price: 149.99, image: lampBlue },
  { id: 6, name: 'Nemuri Lamp', price: 149.99, image: lampGraphite },
  { id: 7, name: 'Nemuri Lamp', price: 149.99, image: lampSand },
  { id: 8, name: 'Nemuri Lamp', price: 149.99, image: lampRed },
];

/**
 * Get price for given cable option
 * @param {string} cableKey - Cable option key ('standard' or 'premium')
 * @returns {number} Price in Lei
 */
export const getPriceForCable = (cableKey) => PRICING[cableKey] || PRICING.standard;

/**
 * Get color by key
 * @param {string} colorKey - Color key
 * @returns {Object|undefined} Color object or undefined
 */
export const getColorByKey = (colorKey) =>
  COLOR_VARIANTS.find((color) => color.key === colorKey);

/**
 * Get color swatch hex by key
 * @param {string} colorKey - Color key
 * @returns {string} Hex color or fallback
 */
export const getColorSwatch = (colorKey) => getColorByKey(colorKey)?.swatch || '#ccc';
