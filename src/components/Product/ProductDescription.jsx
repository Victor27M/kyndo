/**
 * ProductDescription Component
 * Displays the product description text
 */

/**
 * @param {Object} props
 * @param {string} props.description - Product description text
 * @returns {React.ReactElement}
 */
export default function ProductDescription({ description }) {
  return <p className="product__desc">{description}</p>;
}
