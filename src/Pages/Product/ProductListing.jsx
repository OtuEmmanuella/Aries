import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../Firebase/firebaseConfig';
import { PiSlidersHorizontal } from "react-icons/pi";
import { BsGridFill, BsListUl } from 'react-icons/bs';
import FilterSidebar from './FilterSidebar';
import ProductCard from './ProductCard';
import './ProductListing.css';

const categories = [
  {
    label: "MEN",
    children: [
      { label: "Shirts" },
      { label: "Pants" },
      { label: "Sneakers" },
      { label: "Caps" },
    ],
  },
  {
    label: "WOMEN",
    children: [
      { label: "Bags" },
      { label: "Beauty" },
      { label: "Dress" },
    ],
  },
  { label: "SUITS" },
  { label: "T-Shirts" },
];

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'all',
    subcategory: 'all',
    sortBy: 'name',
    sortOrder: 'asc',
    priceRange: { min: 0, max: 1000000 },
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const navigate = useNavigate();
  const location = useLocation();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const newFilters = {
      category: searchParams.get('category') || 'all',
      subcategory: searchParams.get('subcategory') || 'all',
      sortBy: searchParams.get('sortBy') || 'name',
      sortOrder: searchParams.get('sortOrder') || 'asc',
      priceRange: {
        min: Number(searchParams.get('minPrice')) || 0,
        max: Number(searchParams.get('maxPrice')) || 1000000,
      },
    };
    setFilters(newFilters);
  }, [location]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
    setCurrentPage(1);
  }, [filters, products]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    if (filters.category !== 'all') {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    if (filters.subcategory !== 'all') {
      filtered = filtered.filter(product => product.subcategory === filters.subcategory);
    }

    filtered = filtered.filter(product => 
      product.price >= filters.priceRange.min && product.price <= filters.priceRange.max
    );

    filtered.sort((a, b) => {
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

    setFilteredProducts(filtered);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterChange = (newFilters) => {
    const searchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (key === 'priceRange') {
        searchParams.set('minPrice', value.min);
        searchParams.set('maxPrice', value.max);
      } else {
        searchParams.set(key, value);
      }
    });
    navigate(`${location.pathname}?${searchParams.toString()}`);
    setFilters(newFilters);
  };

  const toggleViewMode = () => {
    setViewMode(prevMode => prevMode === 'grid' ? 'list' : 'grid');
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredProducts.length / productsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="product-listing">
      <h1>All Products</h1>
      <div className="controls">
        <button onClick={toggleFilters} className="filter-button">
        <PiSlidersHorizontal /> {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
        <button onClick={toggleViewMode} className="view-mode-button">
          {viewMode === 'grid' ? <BsListUl /> : <BsGridFill />}
        </button>
      </div>
      <div className="content">
        <FilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          showFilters={showFilters}
          toggleFilters={toggleFilters}
          categories={categories}
        />
        <div className="product-content">
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : currentProducts.length > 0 ? (
            <>
              <div className={`product-${viewMode}`}>
                {currentProducts.map(product => (
                  <ProductCard key={product.id} product={product} viewMode={viewMode} />
                ))}
              </div>
              <div className="pagination">
                <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, i) => (
                  <button key={i} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? 'active' : ''}>
                    {i + 1}
                  </button>
                ))}
                <button onClick={nextPage} disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}>Next</button>
              </div>
            </>
          ) : (
            <div className="no-products">No products found matching your criteria.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListing;