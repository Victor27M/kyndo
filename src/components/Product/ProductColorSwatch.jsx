/**
 * ProductColorSwatch Component
 * Displays color variant selection swatches
 */

/**
 * @typedef {Object} ColorOption
 * @property {string} key - Color identifier
 * @property {string} label - Display name
 * @property {string} swatch - Hex color for swatch
 */

/**
 * @param {Object} props
 * @param {ColorOption[]} props.colors - Available color options
 * @param {string} props.selectedColor - Currently selected color key
 * @param {Function} props.onColorChange - Callback when color changes
 * @returns {React.ReactElement}
 */
export default function ProductColorSwatch({
  colors,
  selectedColor,
  onColorChange,
}) {
  const selectedColorLabel =
    colors.find((color) => color.key === selectedColor)?.label || 'Unknown';

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
}
