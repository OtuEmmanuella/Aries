import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="home-page">
      <section className="hero full-width">
        <div className="skeleton skeleton-image" style={{ height: 'calc(100vh - var(--navbar-height))' }}></div>
      </section>

      <section className="featured-categories full-width">
        <div className="category-item">
          <div className="skeleton skeleton-image"></div>
        </div>
        <div className="category-item">
          <div className="skeleton skeleton-image"></div>
        </div>
      </section>

      <section className="scrollable-section">
        <h2 className="skeleton skeleton-text" style={{ width: '200px' }}></h2>
        <div className="scrollable-content">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="product-card">
              <div className="skeleton skeleton-image"></div>
              <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
              <div className="skeleton skeleton-button"></div>
            </div>
          ))}
        </div>
      </section>

      <section className="scrollable-section">
        <h2 className="skeleton skeleton-text" style={{ width: '250px' }}></h2>
        <div className="scrollable-content">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="product-card">
              <div className="skeleton skeleton-image"></div>
              <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
              <div className="skeleton skeleton-button"></div>
            </div>
          ))}
        </div>
      </section>

      <section className="full-width-banner">
        <div className="skeleton skeleton-image" style={{ height: '50vh' }}></div>
      </section>

      <section className="instagram-feed">
        <h2 className="skeleton skeleton-text" style={{ width: '180px', margin: '0 auto' }}></h2>
        <div className="instagram-grid">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="skeleton skeleton-image"></div>
          ))}
        </div>
      </section>

      <section className="newsletter">
        <h2 className="skeleton skeleton-text" style={{ width: '200px', margin: '0 auto' }}></h2>
        <div className="skeleton skeleton-text" style={{ width: '300px', margin: '10px auto' }}></div>
        <div className="newsletter-form">
          <div className="skeleton skeleton-text" style={{ width: '200px', height: '2em' }}></div>
          <div className="skeleton skeleton-button"></div>
        </div>
      </section>
    </div>
  );
};

export default SkeletonLoader;