import type { FC } from 'react';
import type { ProductInfoProps } from '@/types';

const ProductInfo: FC<ProductInfoProps> = ({
  title,
  price,
  currency = 'Lei',
}): React.JSX.Element => {
  return (
    <>
      <h2 className="product__title">{title}</h2>
      <span className="product__price">
        {price.toFixed(2)} {currency}
      </span>
    </>
  );
};

export default ProductInfo;
