import React from 'react';
import styles from './CategoryBanner.module.css';

const CategoryBanner = ({ category, subcategory, productCount }) => {
  const getCategoryContent = () => {
    const categories = {
      men: {
        title: "ALL MEN'S PRODUCTS",
        subtitle: "Stock up on your workout wardrobe or test a fresh fit. Shop all men's products here.",
        image: "/public/gym.png",
        bgColor: "bg-slate-900",
      },
      women: {
        title: "WOMEN'S COLLECTION",
        subtitle: "Elevate your workout wardrobe with our women's fitness clothing collection.",
        image: "/api/placeholder/1200/800",
        bgColor: "bg-rose-900",
      },
      footwear: {
        title: "FOOTWEAR COLLECTION",
        subtitle: "Discover our latest collection of sneakers, sandals, and boots.",
        image: "/path/to/footwear-image.png",
        bgColor: "bg-blue-900",
      },
      beauty: {
        title: "BEAUTY PRODUCTS",
        subtitle: "Shop beauty essentials, from skincare to makeup for a flawless look.",
        image: "/path/to/beauty-image.png",
        bgColor: "bg-pink-900",
      },
      gadgets: {
        title: "GADGETS & ACCESSORIES",
        subtitle: "Explore the latest gadgets including Apple, Samsung, and more.",
        image: "/path/to/gadgets-image.png",
        bgColor: "bg-gray-900",
      },
      // Add more categories or subcategories as needed
    };
    return categories[category?.toLowerCase()] || categories.men;
  };

  const content = getCategoryContent();

  return (
    <div
      className={`${styles.categoryBanner} ${content.bgColor}`}
      style={{ backgroundImage: `url(${content.image})` }}
    >
      <div className={styles.bannerOverlay}>
        <div className={styles.bannerContent}>
          <h1 className={styles.bannerTitle}>{content.title}</h1>
          <p className={styles.bannerSubtitle}>{content.subtitle}</p>
          <p className={styles.productCount}>{productCount} Products</p>
        </div>
      </div>
    </div>
  );
};

export default CategoryBanner;
