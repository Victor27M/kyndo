/**
 * ProductCableOptions Component
 * Displays cable type selection options
 */

/**
 * @typedef {Object} CableOption
 * @property {string} key - Option identifier
 * @property {string} label - Display name
 * @property {string} desc - Description
 */

/**
 * @param {Object} props
 * @param {CableOption[]} props.options - Available cable options
 * @param {string} props.selectedOption - Currently selected option key
 * @param {Function} props.onOptionChange - Callback when option changes
 * @returns {React.ReactElement}
 */
export default function ProductCableOptions({
  options,
  selectedOption,
  onOptionChange,
}) {
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
}
