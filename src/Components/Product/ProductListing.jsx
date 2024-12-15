import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getProducts, urlFor } from '../../services/sanityService';
import { useOfflineData } from '../../hooks/useOfflineData';
import ProductCard from './ProductCard';
import FilterSidebar from './FilterSidebar';
import styles from './ProductListing.module.css';
import { FiGrid, FiList, FiFilter, FiWifiOff } from 'react-icons/fi';

const ProductListing = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [filters, setFilters] = useState({
    category: 'all',
    subcategory: 'all',
    brand: 'all',
    type: 'all',
    sortBy: 'name',
    sortOrder: 'asc',
    priceRange: { min: 0, max: Infinity }
  });

  const location = useLocation();
  const { saveProducts, getProducts: getOfflineProducts } = useOfflineData();

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
    fetchProducts();
  }, [isOnline]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get('category') || 'all';
    const subcategory = searchParams.get('subcategory') || 'all';
    const brand = searchParams.get('brand') || 'all';
    const type = searchParams.get('type') || 'all';
    
    setFilters(prevFilters => ({
      ...prevFilters,
      category,
      subcategory,
      brand,
      type
    }));
  }, [location]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [allProducts, filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let products;
  
      if (isOnline) {
        products = await getProducts(); // Ensure this fetches correctly from Sanity
        if (products && products.length > 0) {
          await saveProducts(products); // Save to IndexedDB
        }
      } else {
        products = await getOfflineProducts(); // Retrieve from IndexedDB
      }
  
      // Update state
      if (products) {
        setAllProducts(products);
        setError(null);
      } else {
        setError('No products available');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  

  const getImageUrl = (images) => {
    if (Array.isArray(images) && images.length > 0 && images[0].asset) {
      return urlFor(images[0]).url();
    }
    return '';
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const applyFiltersAndSort = () => {
    let result = [...allProducts];

    if (filters.category !== 'all') {
      result = result.filter(product => {
        const productCategory = product.category && product.category.toLowerCase();
        const filterCategory = filters.category.toLowerCase();
        return productCategory === filterCategory;
      });
    }

    if (filters.category.toLowerCase() === 'gadgets') {
      if (filters.brand !== 'all') {
        result = result.filter(product => {
          const productBrand = product.brand && product.brand.toLowerCase();
          const filterBrand = filters.brand.toLowerCase();
          return productBrand === filterBrand;
        });
      }

      if (filters.type !== 'all') {
        result = result.filter(product => {
          const productType = product.type && product.type.toLowerCase();
          const filterType = filters.type.toLowerCase();
          return productType === filterType;
        });
      }
    } else {
      if (filters.subcategory !== 'all') {
        result = result.filter(product => {
          const productSubcategory = product.subcategory && product.subcategory.toLowerCase();
          const filterSubcategory = filters.subcategory.toLowerCase();
          return productSubcategory === filterSubcategory;
        });
      }
    }

    result = result.filter(product => 
      product.price >= filters.priceRange.min && 
      product.price <= (filters.priceRange.max === Infinity ? product.price : filters.priceRange.max)
    );

    result.sort((a, b) => {
      if (filters.sortBy === 'name') {
        return filters.sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (filters.sortBy === 'price') {
        return filters.sortOrder === 'asc'
          ? a.price - b.price
          : b.price - a.price;
      }
      return 0;
    });

    setFilteredProducts(result);
  };

  const getTitle = () => {
    const parts = [];
    
    if (filters.category !== 'all') {
      parts.push(filters.category.toUpperCase());
      
      if (filters.category.toLowerCase() === 'gadgets') {
        if (filters.brand !== 'all') parts.push(filters.brand.toUpperCase());
        if (filters.type !== 'all') parts.push(filters.type.toUpperCase());
      } else if (filters.subcategory !== 'all') {
        parts.push(filters.subcategory.toUpperCase());
      }
    }
    
    return parts.length > 0 ? parts.join(' - ') : 'ALL PRODUCTS';
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.productListingContainer}>
      {!isOnline && (
        <div className={styles.offlineBanner}>
          <FiWifiOff className={styles.offlineIcon} />
          <span>You're offline. Showing cached products.</span>
        </div>
      )}

      <FilterSidebar
        filters={filters}
        onFilterChange={handleFilterChange}
        showFilters={showFilters}
        toggleFilters={toggleFilters}
        categories={[]}
      />

      <div className={styles.mainContent}>
        <div className={styles.header}>
          <h1 className={styles.title}>{getTitle()}</h1>
          <p className={styles.productCount}>{filteredProducts.length} Products</p>
        </div>

        <div className={styles.controlsContainer}>
          <div className={styles.viewModeContainer}>
            <button
              className={`${styles.viewModeButton} ${viewMode === 'grid' ? styles.active : ''}`}
              onClick={() => handleViewModeChange('grid')}
            >
              <FiGrid />
            </button>
            <button
              className={`${styles.viewModeButton} ${viewMode === 'list' ? styles.active : ''}`}
              onClick={() => handleViewModeChange('list')}
            >
              <FiList />
            </button>
          </div>
          <button className={styles.filterButton} onClick={toggleFilters}>
            <FiFilter />
            FILTER & SORT
          </button>
        </div>

        <div className={`${styles.productsGrid} ${viewMode === 'list' ? styles.listView : ''}`}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                name={product.name}
                price={product.price}
                compareAtPrice={product.compareAtPrice}
                imageUrl={getImageUrl(product.images)}
                slug={product.slug}
                sku={product.sku}
                tags={product.tags}
              />
            ))
          ) : (
            <p className={styles.noProducts}>No products available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListing;