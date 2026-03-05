/**
 * CartItemRow Component
 * Individual cart item with quantity controls and removal option
 */

import { getColorSwatch } from '../../data/products.js';

/**
 * @typedef {Object} CartItem
 * @property {string} id - Unique item identifier
 * @property {string} name - Product name
 * @property {number} price - Unit price
 * @property {number} qty - Quantity
 * @property {string} image - Product image URL
 * @property {string} [cable] - Cable type
 * @property {string} [color] - Color variant
 */

/**
 * @param {Object} props
 * @param {CartItem} props.item - Cart item to display
 * @param {Function} props.onUpdateQty - Callback to update quantity
 * @param {Function} props.onRemove - Callback to remove item
 * @returns {React.ReactElement}
 */
export default function CartItemRow({ item, onUpdateQty, onRemove }) {
  const handleDecreaseQty = () => {
    if (item.qty > 1) {
      onUpdateQty(item.id, item.qty - 1);
    }
  };

  const handleIncreaseQty = () => {
    onUpdateQty(item.id, item.qty + 1);
  };

  const handleRemove = () => {
    onRemove(item.id);
  };

  return (
    <li className="drawer__row">
      <img className="drawer__thumb" src={item.image} alt={item.name} />

      <div className="drawer__info">
        {/* Top line: name and price */}
        <div className="drawer__top">
          <div className="drawer__name">{item.name}</div>
          <div className="drawer__price">{item.price.toFixed(2)} Lei</div>
        </div>

        {/* Cable variant metadata */}
        {item.cable && (
          <div className="drawer__meta">
            Cable: <span className="capitalize">{item.cable}</span>
          </div>
        )}

        {/* Color variant metadata with swatch */}
        {item.color && (
          <div className="drawer__meta drawer__meta--color">
            <span>
              Color: <span className="capitalize">{item.color}</span>
            </span>
            <span
              className="meta-swatch"
              style={{ background: getColorSwatch(item.color) }}
              aria-hidden="true"
            />
          </div>
        )}

        {/* Quantity controls and remove button */}
        <div className="drawer__controls">
          <div className="qtyinline" role="group" aria-label="Change quantity">
            <button
              className="qtylink"
              type="button"
              aria-label="Decrease quantity"
              onClick={handleDecreaseQty}
              disabled={item.qty <= 1}
            >
              −
            </button>
            <span className="qtynum" aria-live="polite">
              {item.qty}
            </span>
            <button
              className="qtylink"
              type="button"
              aria-label="Increase quantity"
              onClick={handleIncreaseQty}
            >
              +
            </button>
          </div>

          <button
            className="link--muted"
            type="button"
            onClick={handleRemove}
            aria-label={`Remove ${item.name} from cart`}
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
