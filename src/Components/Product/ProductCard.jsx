import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './ProductCard.module.css';

const ProductCard = ({ name, price, compareAtPrice, imageUrl, hoverImageUrl, description, slug, sku, tags }) => {
  const [imageError, setImageError] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    console.log('ProductCard props:', { name, price, compareAtPrice, imageUrl, hoverImageUrl, description, slug, sku, tags });
  }, [name, price, compareAtPrice, imageUrl, hoverImageUrl, description, slug, sku, tags]);

  const handleImageError = (e) => {
    console.error('Image failed to load:', e.target.src);
    setImageError(true);
  };

  const formatPrice = (price) => {
    return `₦${new Intl.NumberFormat().format(price.toFixed(2))}`;
  };

  return (
    <div className={styles.productCard}>
      <Link 
        to={`/product/${slug}`} 
        className={styles.imageContainer}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {imageUrl && !imageError ? (
          <img
            src={isHovering && hoverImageUrl ? hoverImageUrl : imageUrl}
            alt={name}
            className={styles.productImage}
            onError={handleImageError}
          />
        ) : (
          <div className={styles.noImage}>No image available</div>
        )}
        {compareAtPrice && price < compareAtPrice && (
          <span className={styles.discountBadge}>
            {Math.round((1 - price / compareAtPrice) * 100)}% OFF
          </span>
        )}
        <button className={styles.wishlistButton}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </Link>
      <div className={styles.productInfo}>
        <h3 className={styles.productName}>{name}</h3>
        {tags && tags.length > 0 && (
          <p className={styles.productCategory}>{tags[0]}</p>
        )}
        <div className={styles.priceContainer}>
          <span className={styles.price}>{formatPrice(price)}</span>
          {compareAtPrice && compareAtPrice > price && (
            <span className={styles.compareAtPrice}>{formatPrice(compareAtPrice)}</span>
          )}
        </div>
        {description && <p className={styles.productDescription}>{description}</p>}
      </div>
    </div>
  );
};

export default ProductCard;