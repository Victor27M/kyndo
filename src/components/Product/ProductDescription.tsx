import type { FC } from 'react';
import type { ProductDescriptionProps } from '@/types';

const ProductDescription: FC<ProductDescriptionProps> = ({
  description,
}): React.JSX.Element => {
  return <p className="product__desc">{description}</p>;
};

export default ProductDescription;
