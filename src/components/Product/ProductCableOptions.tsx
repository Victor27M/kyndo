import type { FC } from 'react';
import type { ProductCableOptionsProps } from '@/types';

const ProductCableOptions: FC<ProductCableOptionsProps> = ({
  options,
  selectedOption,
  onOptionChange,
}): React.JSX.Element => {
  return (
    <div className="product__options">
      {options.map((option) => (
        <label
          key={option.key}
          className={`opt ${selectedOption === option.key ? 'is-active' : ''}`}
        >
          <input
            type="radio"
            name="cable"
            value={option.key}
            checked={selectedOption === option.key}
            onChange={() => onOptionChange(option.key)}
            aria-label={`Select ${option.label}`}
          />
          <span className="opt__label">{option.label}</span>
          <span className="opt__desc">{option.desc}</span>
        </label>
      ))}
    </div>
  );
};

export default ProductCableOptions;
