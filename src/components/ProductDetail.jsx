import { useParams } from 'react-router-dom';
import Store from './Store.jsx';

/**
 * ProductDetail Component
 * Product page that displays product information and customization options
 *
 * Currently routes all products to the main Store component.
 * In future, productId can be used to display different products.
 *
 * @returns {React.ReactElement} Product display component
 */
export default function ProductDetail() {
  const { productId } = useParams();

  // TODO: Use productId to fetch and display specific product data
  // For now, all products display the same lamp with customization options
  return <Store />;
}
