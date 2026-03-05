/**
 * ProductInfo Component
 * Displays product title and price
 */

/**
 * @param {Object} props
 * @param {string} props.title - Product title
 * @param {number} props.price - Product price
 * @param {string} [props.currency='Lei'] - Currency symbol
 * @returns {React.ReactElement}
 */
export default function ProductInfo({ title, price, currency = 'Lei' }) {
  return (
    <>
      <h2 className="product__title">{title}</h2>
      <span className="product__price">{price.toFixed(2)} {currency}</span>
    </>
  );
}
