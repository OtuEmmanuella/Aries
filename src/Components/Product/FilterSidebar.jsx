import React, { useState, useEffect } from 'react';
import { FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import styles from './FilterSidebar.module.css';

const FilterSidebar = ({ filters, onFilterChange, showFilters, toggleFilters, categories }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    sort: true,
  });

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({ ...prev, [name]: value }));
  };

  const handlePriceRangeChange = (e) => {
    const { value } = e.target;
    const [min, max] = value.split('-').map(Number);
    setLocalFilters(prev => ({
      ...prev,
      priceRange: { min, max }
    }));
  };

  const handleSortChange = (sortBy, sortOrder) => {
    setLocalFilters(prev => ({ ...prev, sortBy, sortOrder }));
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
    toggleFilters();
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const priceRanges = [
    { label: 'All', value: '0-Infinity' },
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
    <div className={`${styles.filterSidebar} ${showFilters ? styles.show : ''}`}>
      <button className={styles.closeFilters} onClick={toggleFilters}>
        <FiX />
      </button>
      <h2 className={styles.filterTitle}>Filters</h2>
      
      <div className={styles.filterSection}>
        <div className={styles.sectionHeader} onClick={() => toggleSection('category')}>
          <h3>Category</h3>
          {expandedSections.category ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        {expandedSections.category && (
          <div className={styles.sectionContent}>
            <label className={styles.filterOption}>
              <input
                type="radio"
                name="category"
                value="all"
                checked={localFilters.category === 'all'}
                onChange={handleInputChange}
              />
              All Categories
            </label>
            {categories.map(category => (
              <label key={category.title} className={styles.filterOption}>
                <input
                  type="radio"
                  name="category"
                  value={category.title.toLowerCase()}
                  checked={localFilters.category === category.title.toLowerCase()}
                  onChange={handleInputChange}
                />
                {category.title}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className={styles.filterSection}>
        <div className={styles.sectionHeader} onClick={() => toggleSection('price')}>
          <h3>Price Range</h3>
          {expandedSections.price ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        {expandedSections.price && (
          <div className={styles.sectionContent}>
            <select
              name="priceRange"
              value={`${localFilters.priceRange.min}-${localFilters.priceRange.max}`}
              onChange={handlePriceRangeChange}
              className={styles.select}
            >
              {priceRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className={styles.filterSection}>
        <div className={styles.sectionHeader} onClick={() => toggleSection('sort')}>
          <h3>Sort By</h3>
          {expandedSections.sort ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        {expandedSections.sort && (
          <div className={styles.sectionContent}>
            <label className={styles.filterOption}>
              <input
                type="radio"
                name="sort"
                checked={localFilters.sortBy === 'name' && localFilters.sortOrder === 'asc'}
                onChange={() => handleSortChange('name', 'asc')}
              />
              Name: A to Z
            </label>
            <label className={styles.filterOption}>
              <input
                type="radio"
                name="sort"
                checked={localFilters.sortBy === 'name' && localFilters.sortOrder === 'desc'}
                onChange={() => handleSortChange('name', 'desc')}
              />
              Name: Z to A
            </label>
            <label className={styles.filterOption}>
              <input
                type="radio"
                name="sort"
                checked={localFilters.sortBy === 'price' && localFilters.sortOrder === 'asc'}
                onChange={() => handleSortChange('price', 'asc')}
              />
              Price: Low to High
            </label>
            <label className={styles.filterOption}>
              <input
                type="radio"
                name="sort"
                checked={localFilters.sortBy === 'price' && localFilters.sortOrder === 'desc'}
                onChange={() => handleSortChange('price', 'desc')}
              />
              Price: High to Low
            </label>
          </div>
        )}
      </div>

      <button className={styles.applyFilters} onClick={applyFilters}>
        Apply Filters
      </button>
    </div>
  );
};

export default FilterSidebar;