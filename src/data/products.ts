import lampBlue from '@/assets/products/lamp/lamp-blue.jpg';
import lampGraphite from '@/assets/products/lamp/lamp-graphite.jpg';
import lampSand from '@/assets/products/lamp/lamp-sand.jpg';
import lampRed from '@/assets/products/lamp/lamp-red.jpg';
import calendarBlue from '@/assets/products/calendar/perpetual-calendar-blue.jpg';
import calendarWhite from '@/assets/products/calendar/perpetual-calendar-white.jpg';
import calendarGreen from '@/assets/products/calendar/perpetual-calendar-green.jpg';
import calendarBordoux from '@/assets/products/calendar/perpetual-calendar-bordoux.jpg';
import type { ColorVariant, CableOption, Product, CatalogProduct } from '@/types';

export const CABLE_OPTIONS: CableOption[] = [
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

export const LAMP_COLOR_VARIANTS: ColorVariant[] = [
  { key: 'blue', label: 'Blue', swatch: '#2358C5', image: lampBlue },
  { key: 'graphite', label: 'Graphite', swatch: '#2b2b2b', image: lampGraphite },
  { key: 'sand', label: 'Sand', swatch: '#d8c9ae', image: lampSand },
  { key: 'red', label: 'Red', swatch: '#b74a3c', image: lampRed },
];

export const CALENDAR_COLOR_VARIANTS: ColorVariant[] = [
  { key: 'white', label: 'White', swatch: '#ffffff', image: calendarWhite },
  { key: 'blue', label: 'Blue', swatch: '#2d3fe1', image: calendarBlue },
  { key: 'green', label: 'Green', swatch: '#0c4123', image: calendarGreen },
  { key: 'bordoux', label: 'Bordeaux', swatch: '#800020', image: calendarBordoux },
];

export const COLOR_VARIANTS = LAMP_COLOR_VARIANTS;

export const PRICING = {
  standard: 179.99,
  premium: 259.99,
} as const;

export const PRODUCTS: Product[] = [
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
    price: PRICING.standard,
    route: '/shop/lamp',
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
    price: 99.99,
    route: '/shop/calendar',
  },
];

export const CATALOG_PRODUCTS: CatalogProduct[] = PRODUCTS.map((product) => ({
  id: product.id,
  name: product.name,
  price: product.basePrice,
  image: product.image,
  route: `/shop/${product.slug}`,
}));

export const getProductBySlug = (slug: string): Product | undefined =>
  PRODUCTS.find((product) => product.slug === slug);

export const getPriceForCable = (cableKey: string): number => {
  const price = PRICING[cableKey as keyof typeof PRICING];
  return price ?? PRICING.standard;
};

export const getColorByKey = (colorKey: string): ColorVariant | undefined =>
  LAMP_COLOR_VARIANTS.find((color) => color.key === colorKey);

export const getColorByKeyInVariants = (
  colorKey: string,
  variants?: ColorVariant[]
): ColorVariant | undefined =>
  (variants || []).find((color) => color.key === colorKey);

export const getColorSwatch = (colorKey: string): string =>
  getColorByKey(colorKey)?.swatch || '#ccc';
