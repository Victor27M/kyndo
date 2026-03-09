import type { FC } from 'react';
import type { ProductColorSwatchProps } from '@/types';

const ProductColorSwatch: FC<ProductColorSwatchProps> = ({
  colors,
  selectedColor,
  onColorChange,
}): React.JSX.Element => {
  const selectedColorLabel = colors.find((color) => color.key === selectedColor)?.label || 'Unknown';

  return (
    <div className="swatches" role="radiogroup" aria-label="Lamp color">
      {colors.map((color) => (
        <button
          key={color.key}
          type="button"
          role="radio"
          aria-checked={selectedColor === color.key}
          className={`swatch ${selectedColor === color.key ? 'is-active' : ''}`}
          style={{ background: color.swatch }}
          onClick={() => onColorChange(color.key)}
          title={color.label}
          aria-label={`Select ${color.label}`}
        />
      ))}
      <div className="swatch__label">
        Color: <strong>{selectedColorLabel}</strong>
      </div>
    </div>
  );
};

export default ProductColorSwatch;
