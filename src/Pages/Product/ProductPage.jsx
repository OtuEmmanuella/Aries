import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, urlFor } from '../../services/sanityService';
import { useOfflineData } from '../../hooks/useOfflineData';
import { SideBySideMagnifier } from 'react-image-magnifiers';
import { Heart, Share2, ChevronDown, WifiOff } from 'lucide-react';
import styles from './ProductPage.module.css';

export default function ProductPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { slug } = useParams();
  const navigate = useNavigate();
  const { saveProductDetail, getProductDetail } = useOfflineData();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    fetchProductData();
  }, [slug, isOnline]);

  async function fetchProductData() {
    if (!slug) {
      setError('Invalid product URL');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let productData;

      if (isOnline) {
        productData = await getProduct(slug);
        if (productData) {
          await saveProductDetail(slug, productData);
        }
      } else {
        productData = await getProductDetail(slug);
      }

      if (productData) {
        setProduct(productData);
        if (productData.colors && productData.colors.length > 0) {
          setSelectedColor(productData.colors[0]);
        }
        setError(null);
      } else {
        setError('Product not found');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      
      if (!isOnline) {
        try {
          const offlineProduct = await getProductDetail(slug);
          if (offlineProduct) {
            setProduct(offlineProduct);
            setError(null);
            return;
          }
        } catch (offlineErr) {
          console.error('Error fetching offline product:', offlineErr);
        }
      }
      
      setError(`Failed to load product. ${isOnline ? 'Please try again later.' : 'No offline data available.'}`);
    } finally {
      setLoading(false);
    }
  }

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setCurrentImageIndex(0);
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const getAvailableSizes = () => {
    if (product.productType === 'clothing' && product.clothingDetails && product.clothingDetails.size) {
      return product.clothingDetails.size;
    } else if (product.productType === 'footwear' && product.footwearDetails && product.footwearDetails.size) {
      return product.footwearDetails.size;
    }
    return [];
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!product) return <div className={styles.error}>Product not found</div>;

  const sizes = getAvailableSizes();

  return (
    <div className={styles.productPage}>
      {!isOnline && (
        <div className={styles.offlineBanner}>
          <WifiOff className={styles.offlineIcon} />
          <span>You're offline. Showing cached product data.</span>
        </div>
      )}

      <div className={styles.productImages}>
        <div className={styles.mainImage}>
          <SideBySideMagnifier
            imageSrc={urlFor(product.images[currentImageIndex]).url()}
            imageAlt={`${product.name} - Image ${currentImageIndex + 1}`}
            alwaysInPlace={true}
            fillAvailableSpace={false}
            fillAlignTop={false}
            fillGapLeft={10}
            fillGapRight={10}
            fillGapTop={10}
            fillGapBottom={10}
          />
        </div>
        <div className={styles.thumbnails}>
          {product.images.map((image, index) => (
            <img
              key={index}
              src={urlFor(image).width(100).url()}
              alt={`${product.name} - Thumbnail ${index + 1}`}
              className={`${styles.thumbnail} ${index === currentImageIndex ? styles.active : ''}`}
              onClick={() => handleThumbnailClick(index)}
            />
          ))}
        </div>
      </div>

      <div className={styles.productDetails}>
        <div className={styles.productHeader}>
          {product.isNew && <div className={styles.newLabel}>NEW</div>}
          <h1 className={styles.productName}>{product.name}</h1>
          {product.fit && <p className={styles.productFit}>{product.fit}</p>}
          <p className={styles.productPrice}>
            ₦{new Intl.NumberFormat().format(product.price.toFixed(2))}
          </p>
        </div>
        
        <div className={styles.productActions}>
          <button className={styles.actionButton} aria-label="Add to favorites">
            <Heart className={styles.actionIcon} />
          </button>
          <button className={styles.actionButton} aria-label="Share product">
            <Share2 className={styles.actionIcon} />
          </button>
        </div>

        {product.colors && product.colors.length > 0 && (
          <div className={styles.colorOptions}>
            <h3>Select Color</h3>
            <div className={styles.colorGrid}>
              {product.colors.map((color, index) => (
                <button
                  key={index}
                  className={`${styles.colorOption} ${selectedColor === color ? styles.selectedColor : ''}`}
                  onClick={() => handleColorSelect(color)}
                  style={{ backgroundColor: color.hex }}
                  aria-label={color.name}
                >
                  <span className={styles.colorName}>{color.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {sizes.length > 0 && (
          <div className={styles.sizeSelection}>
            <div className={styles.sizeHeader}>
              <h3>Select Size</h3>
              <button className={styles.sizeGuide}>Size Guide</button>
            </div>
            <div className={styles.sizeOptions}>
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`${styles.sizeButton} ${selectedSize === size ? styles.selected : ''}`}
                  onClick={() => handleSizeSelect(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          className={styles.addToCartButton}
          disabled={!selectedSize || (!product.inStock && !product.backorder)}
        >
          {selectedSize ? 'ADD TO BAG' : 'SELECT A SIZE'}
        </button>

        <div className={styles.productInfo}>
          <div className={styles.infoSection}>
            <h3>Delivery <ChevronDown /></h3>
            <p>Free standard delivery on orders over ₦50,000</p>
          </div>
          <div className={styles.infoSection}>
            <h3>Description <ChevronDown /></h3>
            <p>{product.description}</p>
          </div>
          {product.specs && product.specs.length > 0 && (
            <div className={styles.infoSection}>
              <h3>Specifications <ChevronDown /></h3>
              <ul>
                {product.specs.map((spec, index) => (
                  <li key={index}>{spec.key}: {spec.value}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}