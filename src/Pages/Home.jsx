import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import './Home.css';
import SkeletonLoader from '.././Components/SkeletonLoaders/HomeSkeletonLoader';

import banner from '/public/Black White Simple Fashion Sale Banner Landscape.gif'
import gym1 from '/public/gym.png'
import gym2 from '/public/gym2.png'
import gym3 from '/public/gym4.png'
import gym4 from '/public/gym5.png'
import gym5 from '/public/gym3.png'
import b2 from '/public/b2.jpg'
import cap from '/public/cap1.jpg'
import s1 from '/public/s1.jpg'
import s2 from '/public/s2.jpg'
import j2 from '/public/j2.jpg'
import bag2 from '/public/bag1.jpg'
import sh1 from '/public/sh1.jpg'
import gym7 from '/public/gym7.jpg'

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <main className="home-page">
      <section className="hero full-width">
        <img className='banner' src={gym5} alt="Hero Banner" />
        <div className="hero-content">
          <h1>New Arrivals</h1>
          <Link to="/new-collection" className="btn btn-primary">Shop Now</Link>
        </div>
      </section>

      <section className="featured-categories full-width">
        <div className="category-item">
          <img src={gym4} alt="Men's Collection" />
          <div className="category-content">
            <h2>Men's Collection</h2>
            <Link to="/men" className="btn btn-secondary">Shop Men</Link>
          </div>
        </div>
        <div className="category-item">
          <img src={gym3} alt="Women's Collection" />
          <div className="category-content">
            <h2>Women's Collection</h2>
            <Link to="/women" className="btn btn-secondary">Shop Women</Link>
          </div>
        </div>
      </section>

      <section className="best-sellers scrollable-section">
        <h2>Best Sellers</h2>
        <div className="scrollable-content">
          <ProductCard name="Classic Tee" price={29.99} image={gym1} />
          <ProductCard name="Performance Leggings" price={59.99} image={gym2} />
          <ProductCard name="Lightweight Jacket" price={79.99} image={gym5} />
          <ProductCard name="Training Shorts" price={39.99} image={cap} />
          <ProductCard name="Running Shoes" price={89.99} image={s2} />
          <ProductCard name="Yoga Mat" price={24.99} image={j2} />
        </div>
      </section>

      <section className="new-drops scrollable-section">
        <h2>New Month New Drops</h2>
        <div className="scrollable-content">
          <ProductCard name="Summer Dress" price={49.99} image={gym3} />
          <ProductCard name="Graphic Tee" price={34.99} image={gym4} />
          <ProductCard name="Denim Jacket" price={69.99} image={s1} />
          <ProductCard name="Swim Shorts" price={29.99} image={bag2} />
          <ProductCard name="Sandals" price={39.99} image={sh1} />
          <ProductCard name="Sunglasses" price={19.99} image={gym7} />
        </div>
      </section>


      

      <section className="full-width-banner">
        <img src={gym2} alt="Special Offer" />
        <div className="banner-content">
          <h2>Summer Sale</h2>
          <p>Up to 50% off selected items</p>
          <Link to="/sale" className="btn btn-primary">Shop Sale</Link>
        </div>
      </section>

      <section className="instagram-feed">
        <h2>@Aries on Instagram</h2>
        <div className="instagram-grid">
          <img src={s1} alt="Instagram post 1" />
          <img src={gym3} alt="Instagram post 2" />
          <img src={gym1} alt="Instagram post 3" />
          <img src={gym2} alt="Instagram post 4" />
        </div>
      </section>

      <section className="newsletter">
        <h2>Join the Community</h2>
        <p>Sign up for exclusive offers, original stories, events and more.</p>
        <form onSubmit={(e) => e.preventDefault()} className="newsletter-form">
          <input type="email" placeholder="Enter your email address" required />
          <button type="submit" className="btn btn-primary">Sign Up</button>
        </form>
      </section>
    </main>
  );
};

const ProductCard = ({ name, price, image }) => (
  <div className="product-card">
    <img src={image} alt={name} />
    <h3>{name}</h3>
    <p>₦{price.toFixed(2)}</p>
    <button className="btn btn-primary">Add to Cart</button>
  </div>
);

export default Home;