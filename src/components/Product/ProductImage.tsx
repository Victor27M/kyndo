import type { FC } from 'react';
import type { ProductImageProps } from '@/types';

const ProductImage: FC<ProductImageProps> = ({ src, alt }): React.JSX.Element => {
  return (
    <div className="store__media">
      <img src={src} alt={alt} className="product__img" />
    </div>
  );
};

export default ProductImage;
