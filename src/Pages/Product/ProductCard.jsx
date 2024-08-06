import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product, viewMode }) => {
  return (
    <div className={`product-card ${viewMode}`}>
      <div className="product-image">
        <img src={product.imageUrl} alt={product.name} />
        <button className="quick-view-btn">Quick View</button>
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <p className="product-price">₦{product.price.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ProductCard;