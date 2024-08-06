import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import './FilterSidebar.css';

const FilterSidebar = ({ filters, onFilterChange, showFilters, toggleFilters, categories }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      setLocalFilters(prev => ({ ...prev, [name]: value, subcategory: 'all' }));
    } else {
      setLocalFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePriceRangeChange = (e) => {
    const { value } = e.target;
    const [min, max] = value.split('-').map(Number);
    setLocalFilters(prev => ({
      ...prev,
      priceRange: { min, max }
    }));
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
    toggleFilters();
  };

  const selectedCategory = categories.find(cat => cat.label === localFilters.category);

  const priceRanges = [
    { label: '4k - 10k', value: '4000-10000' },
    { label: '10k - 20k', value: '10000-20000' },
    { label: '20k - 40k', value: '20000-40000' },
    { label: '40k - 60k', value: '40000-60000' },
    { label: '60k - 75k', value: '60000-75000' },
    { label: '75k - 100k', value: '75000-100000' },
    { label: '100k - 125k', value: '100000-125000' },
    { label: '125k - 150k', value: '125000-150000' },
  ];

  return (
    <div className={`filter-sidebar ${showFilters ? 'show' : ''}`}>
      <div className="filter-content">
        <button className="close-filters" onClick={toggleFilters}>
          <FiX />
        </button>
        <h2>Filters</h2>
        <div className="filter-group">
          <label>Category:</label>
          <select name="category" 
            className='sort'
            value={localFilters.category} onChange={handleInputChange}>
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.label} value={cat.label}>{cat.label}</option>
            ))}
          </select>
        </div>
        {selectedCategory && selectedCategory.children && (
          <div className="filter-group">
            <label>Subcategory:</label>
            <select name="subcategory" 
              className='sort'
              value={localFilters.subcategory} onChange={handleInputChange}>
              <option value="all">All Subcategories</option>
              {selectedCategory.children.map((subcat) => (
                <option key={subcat.label} value={subcat.label}>{subcat.label}</option>
              ))}
            </select>
          </div>
        )}
        <div className="filter-group">
          <label>Sort By:</label>
            <select name="sortBy" 
            className='sort'
            value={`${localFilters.sortBy}-${localFilters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              setLocalFilters(prev => ({ ...prev, sortBy, sortOrder }));
            }}
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Price Range:</label>
          <select
            name="priceRange"
            className='sort'
            value={`${localFilters.priceRange.min}-${localFilters.priceRange.max}`}
            onChange={handlePriceRangeChange}
          >
            <option value="0-0">All Prices</option>
            {priceRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
        <button className="apply-filters" onClick={applyFilters}>
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;