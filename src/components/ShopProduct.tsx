import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '@/cart/CartContext';
import {
  getProductBySlug,
  getPriceForCable,
  getColorByKeyInVariants,
} from '@/data/products';

import ProductImage from '@/components/Product/ProductImage';
import ProductInfo from '@/components/Product/ProductInfo';
import ProductCableOptions from '@/components/Product/ProductCableOptions';
import ProductColorSwatch from '@/components/Product/ProductColorSwatch';
import ProductActions from '@/components/Product/ProductActions';
import ProductDescription from '@/components/Product/ProductDescription';
import type { CartItem, Product } from '@/types';

export default function ShopProduct(): React.JSX.Element {
  const { productSlug } = useParams<{ productSlug?: string }>();
  const navigate = useNavigate();
  const { addItem, openDrawer } = useCart();

  const product = useMemo(
    () => getProductBySlug(productSlug || ''),
    [productSlug]
  ) as Product | undefined;

  const defaultColor = product?.colorVariants?.[0]?.key || 'blue';
  const defaultCable = product?.hasCableOptions
    ? product?.cableOptions?.[0]?.key || 'standard'
    : null;

  const [selectedColor, setSelectedColor] = useState<string>(defaultColor);
  const [selectedCable, setSelectedCable] = useState<string | null>(defaultCable);

  useEffect(() => {
    setSelectedColor(defaultColor);
    setSelectedCable(defaultCable);
  }, [defaultColor, defaultCable]);

  const price = useMemo(() => {
    if (!product) return 0;
    if (!product.hasCableOptions) return product.basePrice;
    return getPriceForCable(selectedCable || 'standard');
  }, [product, selectedCable]);

  const selectedColorData = useMemo(
    () => getColorByKeyInVariants(selectedColor, product?.colorVariants),
    [selectedColor, product]
  );

  const productImage = selectedColorData?.image || product?.image || '';

  const variantName = useMemo(() => {
    if (!product) return '';

     // Display only the product name - cable and color will be shown separately in cart
     return product.name;
   }, [product]);

  const handleAddToCart = useCallback((): void => {
    if (!product || !selectedColor) return;

    const itemId = product.hasCableOptions
      ? `${product.slug}-${selectedCable}-${selectedColor}`
      : `${product.slug}-${selectedColor}`;

    const item: CartItem = {
      id: itemId,
      name: variantName,
      price,
      qty: 1,
      image: productImage,
      productSlug: product.slug,
      color: selectedColor,
      colorLabel: selectedColorData?.label || selectedColor,
      ...(product.hasCableOptions ? { cable: selectedCable || 'standard' } : {}),
    };

    addItem(item);
    openDrawer();
  }, [
    product,
    selectedColor,
    selectedCable,
    variantName,
    price,
    productImage,
    addItem,
    openDrawer,
  ]);

  const handleNotifyClick = useCallback((): void => {
    navigate('/notify');
  }, [navigate]);

  if (!product) {
    return (
      <section className="store__scroller">
        <div className="container store">
          <div className="store__grid">
            <div className="store__info">
              <button
                className="link--muted"
                type="button"
                onClick={() => navigate('/shop')}
                aria-label="Back to shop"
              >
                ← Back to shop
              </button>
              <h2 className="product__title">Product not found</h2>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="store__scroller">
      <div className="container store">
        <div className="store__grid">
          <ProductImage src={productImage} alt={`${product.name} in ${selectedColor}`} />

          <div className="store__info">
            <button
              className="link--muted"
              type="button"
              onClick={() => navigate('/shop')}
              aria-label="Back to shop"
            >
              ← Back to shop
            </button>

            <ProductInfo title={product.name} price={price} currency="Lei" />

            {product.hasCableOptions && (
              <ProductCableOptions
                options={product.cableOptions || []}
                selectedOption={selectedCable || 'standard'}
                onOptionChange={setSelectedCable}
              />
            )}

            <ProductColorSwatch
              colors={product.colorVariants || []}
              selectedColor={selectedColor}
              onColorChange={setSelectedColor}
            />

            <ProductActions
              onAddToCart={handleAddToCart}
              onNotify={handleNotifyClick}
              inStock={product.inStock}
              stockLabel={product.stockLabel}
            />

            <ProductDescription description={product.description} />
          </div>
        </div>
      </div>
    </section>
  );
}
