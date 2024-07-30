import './Header.css';
import React, { useState, useEffect, useRef } from "react";
import { FiMenu, FiSearch, FiUser, FiShoppingCart, FiArrowLeft, FiSettings } from "react-icons/fi";
import { FaTshirt } from 'react-icons/fa';
import { PiPantsFill, PiSneakerMoveFill } from "react-icons/pi"; 
import { GiBilledCap } from "react-icons/gi";
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
    link: "#",
    children: [
      {
        label: "Shirts",
        link: "#",
        icon: FaTshirt,
      },
      {
        label: "Pants",
        link: "#",
        icon: PiPantsFill,
      },
      {
        label: "Sneakers",
        link: "#",
        icon: PiSneakerMoveFill,
      },
      {
        label: "Caps",
        link: "#",
        icon: GiBilledCap,
      },
    ],
  },
  {
    label: "WOMEN",
    link: "#",
    children: [
      {
        label: "Bags",
        link: "#",
      },
      {
        label: "Beauty",
        link: "#",
      },
      {
        label: "Dress",
        link: "#",
      },
    ],
  },
  {
    label: "SUITS",
    link: "#",
  },
  {
    label: "T-Shirts",
    link: "#",
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
        // Check if the user's email matches the admin email
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
          <img src={logo} alt="logo" className="logo" />
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

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  return (
    <div className="nav-item" onClick={toggleDropdown}>
      <p className="nav-item-label">
        <span>{item.label}</span>
        {item.children && <IoIosArrowDown className={`arrow-icon ${isOpen ? 'open' : ''}`} />}
      </p>
      {(isOpen || window.innerWidth >= 768) && item.children && (
        <div className="dropdown">
          {item.children.map((child, index) => (
            <Link key={index} to={child.link ?? "#"} className="dropdown-item">
              {child.icon && <child.icon className='icon-image' />}
              <span className="dropdown-item-label">{child.label}</span>
            </Link>
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
    <div ref={animationParent} onClick={toggleItem} className="single-nav-item">
      <p className="single-nav-item-label">
        <span>{label}</span>
        {children && (
          <IoIosArrowDown className={`arrow-icon ${isItemOpen ? "open" : ""}`} />
        )}
      </p>
      {isItemOpen && children && (
        <div className="single-nav-item-dropdown">
          {children.map((child, index) => (
            <Link key={index} to={child.link ?? "#"} className="single-nav-item-dropdown-item">
              {child.icon && <child.icon className='icon-image' />}
              <span className="single-nav-item-dropdown-item-label">{child.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Navbar;