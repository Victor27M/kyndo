/**
 * Product Configuration
 * Central repository for all product definitions, variants, and options
 */

import lampBlue from '../assets/products/lamp/lamp-blue.jpg';
import lampGraphite from '../assets/products/lamp/lamp-graphite.jpg';
import lampSand from '../assets/products/lamp/lamp-sand.jpg';
import lampRed from '../assets/products/lamp/lamp-red.jpg';
import calendarBlue from '../assets/products/calendar/perpetual-calendar-blue.jpg';
import calendarWhite from '../assets/products/calendar/perpetual-calendar-white.jpg';
import calendarGreen from '../assets/products/calendar/perpetual-calendar-green.jpg';
import calendarBordoux from '../assets/products/calendar/perpetual-calendar-bordoux.jpg';


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
 * Lamp color variants with swatches and images
 * @type {Array<{key: string, label: string, swatch: string, image: string}>}
 */
export const LAMP_COLOR_VARIANTS = [
  { key: 'blue', label: 'Blue', swatch: '#2358C5', image: lampBlue },
  { key: 'graphite', label: 'Graphite', swatch: '#2b2b2b', image: lampGraphite },
  { key: 'sand', label: 'Sand', swatch: '#d8c9ae', image: lampSand },
  { key: 'red', label: 'Red', swatch: '#b74a3c', image: lampRed },
];

/**
 * Calendar color variants with swatches and images
 * @type {Array<{key: string, label: string, swatch: string, image: string}>}
 */
export const CALENDAR_COLOR_VARIANTS = [
  { key: 'white', label: 'White', swatch: '#ffffff', image: calendarWhite },
  { key: 'blue', label: 'Blue', swatch: '#2d3fe1', image: calendarBlue },
  { key: 'green', label: 'Green', swatch: '#0c4123', image: calendarGreen },
  { key: 'bordoux', label: 'Bordeaux', swatch: '#800020', image: calendarBordoux },
  
];

// Backward compatibility for existing Store component
export const COLOR_VARIANTS = LAMP_COLOR_VARIANTS;

/**
 * Price configuration by cable type
 * @type {Object<string, number>}
 */
export const PRICING = {
  standard: 179.99,
  premium: 259.99,
};

/**
 * Main product definitions
 * Add a new product here and it will automatically appear in catalog and be routable
 * @type {Array<{
 *   id: string,
 *   slug: string,
 *   name: string,
 *   basePrice: number,
 *   image: string,
 *   description: string,
 *   inStock: boolean,
 *   stockLabel: string,
 *   hasCableOptions: boolean,
 *   cableOptions?: Array<{key: string, label: string, desc: string}>,
 *   colorVariants: Array<{key: string, label: string, swatch: string, image: string}>
 * }>}
 */
export const PRODUCTS = [
  {
    id: 'nemuri-lamp',
    slug: 'lamp',
    name: 'Nemuri Lamp',
    basePrice: PRICING.standard,
    image: lampBlue,
    description:
      'A sculptural silhouette with a soft glow. Sustainably made, modular for easy repair, and designed to complement calm interiors.',
    inStock: true,
    stockLabel: 'Made to order',
    hasCableOptions: true,
    cableOptions: CABLE_OPTIONS,
    colorVariants: LAMP_COLOR_VARIANTS,
  },
  {
    id: 'perpetual-calendar',
    slug: 'calendar',
    name: 'Perpetual Calendar',
    basePrice: 99.99,
    image: calendarWhite,
    description:
      'A timeless desk companion designed to be part of your daily ritual. Sustainable construction with a minimal aesthetic that fits any space.',
    inStock: true,
    stockLabel: 'In Stock',
    hasCableOptions: false,
    colorVariants: CALENDAR_COLOR_VARIANTS,
  },
];

/**
 * Catalog products derived from product definitions
 * @type {Array<{id: string, name: string, price: number, image: string, route: string}>}
 */
export const CATALOG_PRODUCTS = PRODUCTS.map((product) => ({
  id: product.id,
  name: product.name,
  price: product.basePrice,
  image: product.image,
  route: `/shop/${product.slug}`,
}));

/**
 * Get product definition by slug
 * @param {string} slug - Product slug (e.g., lamp, calendar)
 * @returns {Object|undefined} Product definition or undefined
 */
export const getProductBySlug = (slug) =>
  PRODUCTS.find((product) => product.slug === slug);

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
  LAMP_COLOR_VARIANTS.find((color) => color.key === colorKey);

/**
 * Get color by key in a specific color set
 * @param {string} colorKey - Color key
 * @param {Array<{key: string, label: string, swatch: string, image: string}>} variants - Variant list
 * @returns {Object|undefined} Color object or undefined
 */
export const getColorByKeyInVariants = (colorKey, variants = []) =>
  variants.find((color) => color.key === colorKey);

/**
 * Get color swatch hex by key
 * @param {string} colorKey - Color key
 * @returns {string} Hex color or fallback
 */
export const getColorSwatch = (colorKey) => getColorByKey(colorKey)?.swatch || '#ccc';
