/**
 * ProductImage Component
 * Displays the product image with proper aspect ratio and loading
 */

/**
 * @param {Object} props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Image alt text
 * @returns {React.ReactElement}
 */
export default function ProductImage({ src, alt }) {
  return (
    <div className="store__media">
      <img src={src} alt={alt} className="product__img" />
    </div>
  );
}
