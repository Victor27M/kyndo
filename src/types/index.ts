/**
 * React Type Definitions
 * Centralized types for all React components, context, and hooks
 */

import React from 'react';

/**
 * Root component types
 */
export type FC<P = object> = React.FunctionComponent<P>;

/**
 * Cart Context Types
 */
export interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  cable?: string;
  color?: string;
  colorLabel?: string;
  productSlug?: string;
}

export interface CartContextType {
  items: CartItem[];
  itemsCount: number;
  subtotal: number;
  addItem(item: CartItem): void;
  updateQty(id: string, qty: number): void;
  removeItem(id: string): void;
  clearCart(): void;
  openDrawer(): void;
  closeDrawer(): void;
  isDrawerOpen: boolean;
}

/**
 * Product Types
 */
export interface ColorVariant {
  key: string;
  label: string;
  swatch: string;
  image: string;
}

export interface CableOption {
  key: string;
  label: string;
  desc: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  basePrice: number;
  image: string;
  description: string;
  inStock: boolean;
  stockLabel: string;
  hasCableOptions: boolean;
  cableOptions?: CableOption[];
  colorVariants: ColorVariant[];
  price?: number;
  route?: string;
}

export interface CatalogProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  route: string;
}

/**
 * Component Props Types
 */
export interface ProductImageProps {
  src: string;
  alt: string;
}

export interface ProductInfoProps {
  title: string;
  price: number;
  currency?: string;
}

export interface ProductColorSwatchProps {
  colors: ColorVariant[];
  selectedColor: string;
  onColorChange(color: string): void;
}

export interface ProductCableOptionsProps {
  options: CableOption[];
  selectedOption: string;
  onOptionChange(cable: string): void;
}

export interface ProductActionsProps {
  onAddToCart(): void;
  onNotify(): void;
  isLoading?: boolean;
  inStock?: boolean;
  stockLabel?: string;
}

export interface ProductDescriptionProps {
  description: string;
}

export interface CartItemRowProps {
  item: CartItem;
  onUpdateQty(id: string, qty: number): void;
  onRemove(id: string): void;
}

export interface CartSummaryProps {
  subtotal: number;
  onCheckout(): void;
  isLoading?: boolean;
}

/**
 * Framer Motion Types
 */
export interface FramerMotionVariants {
  [key: string]: any;
}

export interface ViewportSettings {
  once: boolean;
  amount: number;
}

/**
 * Hook Types
 */
export interface UseCartReturn {
  items: CartItem[];
  itemsCount: number;
  total: number;
  addItem(item: CartItem): void;
  updateQty(id: string, qty: number): void;
  removeItem(id: string): void;
  clearCart(): void;
  openDrawer(): void;
  closeDrawer(): void;
  isDrawerOpen: boolean;
}

/**
 * API Response Types
 */
export interface ApiSuccessResponse<T> {
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

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Form Types
 */
export interface WaitlistFormData {
  email: string;
}

export interface CheckoutItem {
  qty: number;
  cable: 'standard' | 'premium';
}

export interface CheckoutRequest {
  items: CheckoutItem[];
  shippingRate?: string;
}

/**
 * Animation Types
 */
export interface AnimationVariant {
  hidden: object;
  show: object;
}

export interface StaggerConfig {
  staggerChildren: number;
  delayChildren?: number;
}
