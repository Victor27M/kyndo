import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/cart/CartContext';
import { CABLE_OPTIONS, COLOR_VARIANTS, getPriceForCable, getColorByKey } from '@/data/products';

import ProductImage from '@/components/Product/ProductImage';
import ProductInfo from '@/components/Product/ProductInfo';
import ProductCableOptions from '@/components/Product/ProductCableOptions';
import ProductColorSwatch from '@/components/Product/ProductColorSwatch';
import ProductActions from '@/components/Product/ProductActions';
import ProductDescription from '@/components/Product/ProductDescription';
import type { CartItem } from '@/types';

const PRODUCT_NAME = 'Nemuri Lamp';
const PRODUCT_DESCRIPTION =
  'A sculptural silhouette with a soft glow. Sustainably made, modular for easy repair, and designed to complement calm interiors.';

export default function Store(): React.JSX.Element {
  const [selectedCable, setSelectedCable] = useState<string>('standard');
  const [selectedColor, setSelectedColor] = useState<string>('blue');
  const navigate = useNavigate();
  const { addItem, openDrawer } = useCart();

  const inStock = true;
  const stockLabel = inStock ? 'Made to order' : 'Sold Out';

  const price = useMemo(() => getPriceForCable(selectedCable), [selectedCable]);

  const getProductImage = useCallback((): string => {
    const color = getColorByKey(selectedColor);
    return color?.image || '';
  }, [selectedColor]);

  const handleAddToCart = useCallback((): void => {
    if (!selectedCable || !selectedColor) {
      return;
    }

    const cartItemId = `nemuri-${selectedCable}-${selectedColor}`;
    const colorData = getColorByKey(selectedColor);
    const item: CartItem = {
      id: cartItemId,
      name: PRODUCT_NAME,
      price,
      qty: 1,
      image: getProductImage(),
      cable: selectedCable,
      color: selectedColor,
      colorLabel: colorData?.label || selectedColor,
      productSlug: 'nemuri',
    };
    addItem(item);
    openDrawer();
  }, [selectedCable, selectedColor, price, addItem, openDrawer, getProductImage]);

  const handleNotifyClick = useCallback((): void => {
    navigate('/notify');
  }, [navigate]);

  return (
    <section className="store__scroller">
      <div className="container store">
        <div className="store__grid">
          <ProductImage src={getProductImage()} alt={`${PRODUCT_NAME} in ${selectedColor}`} />

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
