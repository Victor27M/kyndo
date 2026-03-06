import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../cart/CartContext.jsx';
import { getProductBySlug, getPriceForCable, getColorByKeyInVariants } from '../data/products.js';

import ProductImage from './Product/ProductImage.jsx';
import ProductInfo from './Product/ProductInfo.jsx';
import ProductCableOptions from './Product/ProductCableOptions.jsx';
import ProductColorSwatch from './Product/ProductColorSwatch.jsx';
import ProductActions from './Product/ProductActions.jsx';
import ProductDescription from './Product/ProductDescription.jsx';

/**
 * ShopProduct Component
 * Generic data-driven product page for shop items
 */
export default function ShopProduct() {
  const { productSlug } = useParams();
  const navigate = useNavigate();
  const { addItem, openDrawer } = useCart();

  const product = useMemo(() => getProductBySlug(productSlug), [productSlug]);

  const defaultColor = product?.colorVariants?.[0]?.key || 'blue';
  const defaultCable = product?.hasCableOptions ? product?.cableOptions?.[0]?.key || 'standard' : null;

  const [selectedColor, setSelectedColor] = useState(defaultColor);
  const [selectedCable, setSelectedCable] = useState(defaultCable);

  useEffect(() => {
    setSelectedColor(defaultColor);
    setSelectedCable(defaultCable);
  }, [defaultColor, defaultCable]);

  const price = useMemo(() => {
    if (!product) return 0;
    if (!product.hasCableOptions) return product.basePrice;
    return getPriceForCable(selectedCable);
  }, [product, selectedCable]);

  const selectedColorData = useMemo(
    () => getColorByKeyInVariants(selectedColor, product?.colorVariants),
    [selectedColor, product]
  );

  const productImage = selectedColorData?.image || product?.image || '';

  const variantName = useMemo(() => {
    if (!product) return '';

    const colorLabel = selectedColorData?.label || selectedColor;
    if (!product.hasCableOptions) {
      return `${product.name} — ${colorLabel}`;
    }

    const cableLabel =
      product.cableOptions?.find((option) => option.key === selectedCable)?.label || '';
    return `${product.name} — ${cableLabel} cable — ${colorLabel}`;
  }, [product, selectedColorData, selectedColor, selectedCable]);

  const handleAddToCart = useCallback(() => {
    if (!product || !selectedColor) return;

    const itemId = product.hasCableOptions
      ? `${product.slug}-${selectedCable}-${selectedColor}`
      : `${product.slug}-${selectedColor}`;

    addItem({
      id: itemId,
      name: variantName,
      price,
      qty: 1,
      image: productImage,
      productSlug: product.slug,
      color: selectedColor,
      ...(product.hasCableOptions ? { cable: selectedCable } : {}),
    });

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

  const handleNotifyClick = useCallback(() => {
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
                options={product.cableOptions}
                selectedOption={selectedCable}
                onOptionChange={setSelectedCable}
              />
            )}

            <ProductColorSwatch
              colors={product.colorVariants}
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
