import React, { useState, useEffect } from 'react';
import { getProducts, urlFor } from '../../services/sanityService';
import ProductCard from './ProductCard';
import styles from './ProductGrid.module.css';

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        console.log('Raw products data:', response);
        
        if (response && Array.isArray(response)) {
          const formattedProducts = response.map(product => ({
            name: product.name,
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            imageUrl: product.images && product.images[0] ? urlFor(product.images[0]).url() : null,
            hoverImageUrl: product.images && product.images[1] ? urlFor(product.images[1]).url() : null,
            description: Array.isArray(product.description) 
              ? product.description[0].children[0].text 
              : product.description,
            slug: product.slug?.current,
            tags: product.tags,
          }));
          console.log('Formatted products:', formattedProducts);
          setProducts(formattedProducts);
        } else {
          console.error('Invalid response structure:', response);
          setError('Failed to format product data');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading products...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!products.length) {
    return <div className={styles.noProducts}>No products found</div>;
  }

  return (
    <div className={styles.productGrid}>
      {products.map((product, index) => (
        <ProductCard
          key={`${product.slug}-${index}`}
          {...product}
        />
      ))}
    </div>
  );
};

export default ProductGrid;