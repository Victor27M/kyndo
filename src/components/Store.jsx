import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../cart/CartContext.jsx';
import {
  CABLE_OPTIONS,
  COLOR_VARIANTS,
  getPriceForCable,
  getColorByKey,
} from '../data/products.js';

import ProductImage from './Product/ProductImage.jsx';
import ProductInfo from './Product/ProductInfo.jsx';
import ProductCableOptions from './Product/ProductCableOptions.jsx';
import ProductColorSwatch from './Product/ProductColorSwatch.jsx';
import ProductActions from './Product/ProductActions.jsx';
import ProductDescription from './Product/ProductDescription.jsx';

const PRODUCT_NAME = 'Nemuri Lamp';
const PRODUCT_DESCRIPTION =
  'A sculptural silhouette with a soft glow. Sustainably made, modular for easy repair, and designed to complement calm interiors.';

/**
 * Store Component
 * Main product display and customization interface
 * Handles cable and color variant selection with real-time pricing
 */
export default function Store() {
  const [selectedCable, setSelectedCable] = useState('standard');
  const [selectedColor, setSelectedColor] = useState('blue');
  const navigate = useNavigate();
  const { addItem, openDrawer } = useCart();

  // Stock state (can be connected to real inventory later)
  const inStock = true; // Set to false to show "Sold Out — Notify Me"
  const stockLabel = inStock ? 'Made to order' : 'Sold Out';

  // Calculate price based on selected cable
  const price = useMemo(
    () => getPriceForCable(selectedCable),
    [selectedCable]
  );

  // Get variant name for cart display
  const getVariantName = useCallback(() => {
    const cableLabel =
      CABLE_OPTIONS.find((opt) => opt.key === selectedCable)?.label || '';
    return `${PRODUCT_NAME} — ${cableLabel} cable`;
  }, [selectedCable]);

  // Get product image based on selected color
  const getProductImage = useCallback(() => {
    const color = getColorByKey(selectedColor);
    return color?.image || '';
  }, [selectedColor]);

  // Handle adding item to cart
  const handleAddToCart = useCallback(() => {
    if (!selectedCable || !selectedColor) {
      return; // Guard: Ensure selections are valid
    }

    const cartItemId = `nemuri-${selectedCable}-${selectedColor}`;
    addItem({
      id: cartItemId,
      name: getVariantName(),
      price,
      qty: 1,
      image: getProductImage(),
      cable: selectedCable,
      color: selectedColor,
    });
    openDrawer();
  }, [
    selectedCable,
    selectedColor,
    price,
    addItem,
    openDrawer,
    getVariantName,
    getProductImage,
  ]);

  // Handle navigation to notify page
  const handleNotifyClick = useCallback(() => {
    navigate('/notify');
  }, [navigate]);

  return (
    <section className="store__scroller">
      <div className="container store">
        <div className="store__grid">
          <ProductImage
            src={getProductImage()}
            alt={`${PRODUCT_NAME} in ${selectedColor}`}
          />

          <div className="store__info">
            <ProductInfo title={PRODUCT_NAME} price={price} currency="Lei" />

            <ProductCableOptions
              options={CABLE_OPTIONS}
              selectedOption={selectedCable}
              onOptionChange={setSelectedCable}
            />

            <ProductColorSwatch
              colors={COLOR_VARIANTS}
              selectedColor={selectedColor}
              onColorChange={setSelectedColor}
            />

            <ProductActions
              onAddToCart={handleAddToCart}
              onNotify={handleNotifyClick}
              inStock={inStock}
              stockLabel={stockLabel}
            />

            <ProductDescription description={PRODUCT_DESCRIPTION} />
          </div>
        </div>
      </div>
    </section>
  );
}
