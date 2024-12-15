import './Header.css';
import React, { useState, useEffect, useRef } from "react";
import { FiMenu, FiSearch, FiUser, FiShoppingCart, FiArrowLeft, FiSettings } from "react-icons/fi";
import { FaTshirt } from 'react-icons/fa';
import { PiPantsFill, PiSneakerMoveFill } from "react-icons/pi"; 
import { GiBilledCap } from "react-icons/gi";
import { GiSandal } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import { IoIosArrowDown } from "react-icons/io";
import { SlHandbag } from "react-icons/sl";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../Firebase/firebaseConfig';
import { getIdTokenResult } from "firebase/auth";

const logo = "/Aries Logo.gif";

const navItems = [
  {
    label: "MEN",
    link: "/products?category=men",
    children: [
      {
        label: "Shirts",
        link: "/products?category=men&subcategory=shirts",
        icon: FaTshirt,
      },
      {
        label: "Pants",
        link: "/products?category=men&subcategory=pants",
        icon: PiPantsFill,
      },
      {
        label: "Sneakers",
        link: "/products?category=men&subcategory=sneakers",
        icon: PiSneakerMoveFill,
      },
      {
        label: "Caps",
        link: "/products?category=men&subcategory=caps",
        icon: GiBilledCap,
      },
      {
        label: "Shorts",
        link: "/products?category=men&subcategory=shorts",
        icon: PiPantsFill,
      },
    ],
  },
  {
    label: "WOMEN",
    link: "/products?category=women",
    children: [
      {
        label: "Bags",
        link: "/products?category=women&subcategory=bags",
        icon: SlHandbag,
      },
      {
        label: "Accessories",
        link: "/products?category=women&subcategory=accessories",
      },
      {
        label: "Dresses",
        link: "/products?category=women&subcategory=dresses",
        icon: FaTshirt,
      },
    ],
  },
  {
    label: "FOOTWEAR",
    link: "/products?category=footwear",
    children: [
      {
        label: "Sneakers",
        link: "/products?category=footwear&subcategory=sneakers",
        icon: PiSneakerMoveFill,
      },
      {
        label: "Sandals",
        link: "/products?category=footwear&subcategory=sandals",
        icon: GiSandal,
      },
      {
        label: "Boots",
        link: "/products?category=footwear&subcategory=boots",
      },
    ],
  },
  {
    label: "Beauty",
    link: "/products?category=beauty",
    children: [
      {
        label: "Makeup",
        link: "/products?category=beauty&subcategory=makeup",
        children: [
          {
            label: "Face",
            link: "/products?category=beauty&subcategory=makeup&type=face",
          },
          {
            label: "Eyes",
            link: "/products?category=beauty&subcategory=makeup&type=eyes",
          },
          {
            label: "Lips",
            link: "/products?category=beauty&subcategory=makeup&type=lips",
          },
        ],
      },
      {
        label: "Skincare",
        link: "/products?category=beauty&subcategory=skincare",
        children: [
          {
            label: "Cleansers",
            link: "/products?category=beauty&subcategory=skincare&type=cleansers",
          },
          {
            label: "Moisturizers",
            link: "/products?category=beauty&subcategory=skincare&type=moisturizers",
          },
          {
            label: "Sunscreens",
            link: "/products?category=beauty&subcategory=skincare&type=sunscreens",
          },
        ],
      },
      {
        label: "Hair Care",
        link: "/products?category=beauty&subcategory=haircare",
        children: [
          {
            label: "Shampoos",
            link: "/products?category=beauty&subcategory=haircare&type=shampoos",
          },
          {
            label: "Conditioners",
            link: "/products?category=beauty&subcategory=haircare&type=conditioners",
          },
          {
            label: "Styling Products",
            link: "/products?category=beauty&subcategory=haircare&type=styling",
          },
        ],
      },
    ],
  },
  {
    label: "Gadgets",
    link: "/products?category=gadgets",
    children: [
      {
        label: "Apple",
        link: "/products?category=gadgets&brand=apple",
        children: [
          {
            label: "MacBooks",
            link: "/products?category=gadgets&brand=apple&type=macbooks",
          },
          {
            label: "Phones",
            link: "/products?category=gadgets&brand=apple&type=phones",
          },
          {
            label: "Airpods",
            link: "/products?category=gadgets&brand=apple&type=airpods",
          },
          {
            label: "Watch",
            link: "/products?category=gadgets&brand=apple&type=watch",
          },
          {
            label: "Vision",
            link: "/products?category=gadgets&brand=apple&type=vision",
          },
          {
            label: "iPads",
            link: "/products?category=gadgets&brand=apple&type=ipad",
          },
        ],
      },
      {
        label: "Samsung",
        link: "/products?category=gadgets&brand=samsung",
        children: [
          {
            label: "Laptops",
            link: "/products?category=gadgets&brand=samsung&type=laptops",
          },
          {
            label: "Phones",
            link: "/products?category=gadgets&brand=samsung&type=phones",
          },
        ],
      },
      {
        label: "HP",
        link: "/products?category=gadgets&brand=hp",
        children: [
          {
            label: "PCs",
            link: "/products?category=gadgets&brand=hp&type=laptops",
          },
        ],
      },
    ],
  },
];

function Navbar() {
  const [animationParent] = useAutoAnimate();
  const [isSideMenuOpen, setSideMenu] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const searchInputRef = useRef(null);
  const userDropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWindowWidth(newWidth);
      if (newWidth >= 768) {
        setSideMenu(false);
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setIsLoggedIn(true);
        if (user.email === 'admin@example.com') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  function openSideMenu() {
    setSideMenu(true);
  }

  function closeSideMenu() {
    setSideMenu(false);
  }

  function toggleSearch() {
    setIsSearchOpen(!isSearchOpen);
  }

  function toggleUserDropdown() {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  }

  function handleLogout() {
    auth.signOut().then(() => {
      console.log("User logged out successfully!");
      setIsUserDropdownOpen(false);
      setIsLoggedIn(false);
      navigate('/');
    }).catch((error) => {
      console.error("Error logging out:", error.message);
    });
  }

  return (
    <div className={`navbar ${isSearchOpen && windowWidth < 768 ? 'search-active' : ''}`}>
      <div className="navbar-content">
        <section ref={animationParent} className="navbar-left">
        <Link to="/">
           <img src={logo} alt="logo" className="logo" />
       </Link>
          {windowWidth >= 768 && (
            <div className="nav-items">
              {navItems.map((item, index) => (
                <NavItem key={index} item={item} />
              ))}
            </div>
          )}
        </section>

        <section className={`navbar-right ${isSearchOpen && windowWidth < 768 ? 'search-active' : ''}`}>
          {windowWidth >= 768 ? (
            <>
              <div className="search-container">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search..."
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                <FiSearch className="search-icon" />
              </div>
              <div className="user-dropdown-container" ref={userDropdownRef}>
                <FiUser 
                  className="icon-button" 
                  onClick={toggleUserDropdown}
                  onMouseEnter={() => setIsUserDropdownOpen(true)}
                />
                {isUserDropdownOpen && (
                  <div className="user-dropdown">
                    {isLoggedIn ? (
                      <>
                        <Link to="/profile" className="user-dropdown-item">My Account</Link>
                        <span className="user-dropdown-item" onClick={handleLogout}>Logout</span>
                      </>
                    ) : (
                      <>
                        <Link to="/login" className="user-dropdown-item">Login</Link>
                        <Link to="/signup" className="user-dropdown-item">Sign Up</Link>
                      </>
                    )}
                  </div>
                )}
              </div>
              <SlHandbag className="icon-button" />
              {isLoggedIn && isAdmin && (
                <Link to="/admin" className="admin-dashboard-link">
                  <FiSettings className="icon-button" />
                  <span className="admin-dashboard-text">Dashboard</span>
                </Link>
              )}
            </>
          ) : isSearchOpen ? (
            <div className="mobile-search-container">
              <FiArrowLeft className="icon-button" onClick={toggleSearch} />
              <input
                ref={searchInputRef}
                type="text"
                className="mobile-search-input"
                placeholder="Search..."
              />
            </div>
          ) : (
            <>
              <FiSearch className="icon-button" onClick={toggleSearch} />
              <div className="user-dropdown-container" ref={userDropdownRef}>
                <FiUser 
                  className="icon-button" 
                  onClick={toggleUserDropdown}
                />
                {isUserDropdownOpen && (
                  <div className="user-dropdown">
                    {isLoggedIn ? (
                      <>
                        <Link to="/profile" className="user-dropdown-item">My Account</Link>
                        <span className="user-dropdown-item" onClick={handleLogout}>Logout</span>
                      </>
                    ) : (
                      <>
                        <Link to="/login" className="user-dropdown-item">Login</Link>
                        <Link to="/signup" className="user-dropdown-item">Sign Up</Link>
                      </>
                    )}
                  </div>
                )}
              </div>
              <SlHandbag className="icon-button" />
              {isLoggedIn && isAdmin && (
                <Link to="/admin" className="admin-dashboard-link">
                  <FiSettings className="icon-button" />
                </Link>
              )}
              <FiMenu onClick={openSideMenu} className="menu-icon" />
            </>
          )}
        </section>
      </div>

      {windowWidth < 768 && isSideMenuOpen && (
        <MobileNav closeSideMenu={closeSideMenu} />
      )}
    </div>
  );
}

function NavItem({ item }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="nav-item" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <Link to={item.link} className="nav-item-label">
        <span>{item.label}</span>
        {item.children && <IoIosArrowDown className={`arrow-icon ${isOpen ? 'open' : ''}`} />}
      </Link>
      {isOpen && item.children && (
        <div className="dropdown">
          {item.children.map((child, index) => (
            child.children ? (
              <NavItem key={index} item={child} />
            ) : (
              <Link key={index} to={child.link} className="dropdown-item">
                {child.icon && <child.icon className='icon-image' />}
                <span className="dropdown-item-label">{child.label}</span>
              </Link>
            )
          ))}
        </div>
      )}
    </div>
  );
}

function MobileNav({ closeSideMenu }) {
  return (
    <div className="mobile-nav">
      <div className="mobile-nav-content">
        <section className="mobile-nav-close">
          <AiOutlineClose onClick={closeSideMenu} className="close-icon" />
        </section>
       
        <div className="mobile-nav-items">
          {navItems.map((item, index) => (
            <SingleNavItem key={index} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SingleNavItem({ label, children, link }) {
  const [animationParent] = useAutoAnimate();
  const [isItemOpen, setItem] = useState(false);

  function toggleItem() {
    setItem(!isItemOpen);
  }

  return (
    <div ref={animationParent} className="single-nav-item">
      <p className="single-nav-item-label" onClick={toggleItem}>
        <span>{label}</span>
        {children && (
          <IoIosArrowDown className={`arrow-icon ${isItemOpen ? "open" : ""}`} />
        )}
      </p>
      {isItemOpen && children && (
        <div className="single-nav-item-dropdown">
          {children.map((child, index) => (
            child.children ? (
              <SingleNavItem key={index} {...child} />
            ) : (
              <Link key={index} to={child.link ?? "#"} className="single-nav-item-dropdown-item">
                {child.icon && <child.icon className='icon-image' />}
                <span className="single-nav-item-dropdown-item-label">{child.label}</span>
              </Link>
            )
          ))}
        </div>
      )}
    </div>
  );
}

export default Navbar;