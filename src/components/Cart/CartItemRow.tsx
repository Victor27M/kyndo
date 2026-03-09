import type { FC } from 'react';
import { getColorSwatch } from '@/data/products';
import type { CartItemRowProps } from '@/types';

const CartItemRow: FC<CartItemRowProps> = ({ item, onUpdateQty, onRemove }): React.JSX.Element => {
  const handleDecreaseQty = (): void => {
    if (item.qty > 1) {
      onUpdateQty(item.id, item.qty - 1);
    }
  };

  const handleIncreaseQty = (): void => {
    onUpdateQty(item.id, item.qty + 1);
  };

  const handleRemove = (): void => {
    onRemove(item.id);
  };

  return (
    <li className="drawer__row">
      <img className="drawer__thumb" src={item.image} alt={item.name} />

      <div className="drawer__info">
        <div className="drawer__top">
          <div className="drawer__name">{item.name}</div>
          <div className="drawer__price">{item.price.toFixed(2)} Lei</div>
        </div>

        {item.cable && (
          <div className="drawer__meta">
            Cable: <span className="capitalize">{item.cable}</span>
          </div>
        )}

        {item.color && (
          <div className="drawer__meta drawer__meta--color">
            <span>
              Color: <span className="capitalize">{item.colorLabel || item.color}</span>
            </span>
            <span
              className="meta-swatch"
              style={{ background: getColorSwatch(item.color) }}
              aria-hidden="true"
            />
          </div>
        )}

        <div className="drawer__controls">
          <div className="qtyinline" role="group" aria-label="Change quantity">
            <button
              className="qtylink"
              type="button"
              aria-label="Decrease quantity"
              onClick={handleDecreaseQty}
            >
              −
            </button>
            <span className="qtyval">{item.qty}</span>
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
            className="qtyremove"
            type="button"
            aria-label="Remove from cart"
            onClick={handleRemove}
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
};

export default CartItemRow;
