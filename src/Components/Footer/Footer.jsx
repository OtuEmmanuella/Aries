import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaPinterestP } from 'react-icons/fa';
import { MdEmail, MdPhone } from 'react-icons/md';
import AriesLogo from '/Aries Logo.gif'
import './Footer.css';

const Footer = () => {
  return (
    <footer className="aries-footer">
      <div className="aries-footer__content">
        <div className="aries-footer__section aries-footer__logo-section">
          <img src={AriesLogo} alt="Aries Logo" className="aries-footer__logo" />
        </div>
        <div className="aries-footer__section aries-footer__links-section">
          <h3 className="aries-footer__heading">Quick Links</h3>
          <ul className="aries-footer__list">
            <li className="aries-footer__list-item"><a href="/about" className="aries-footer__link">About Us</a></li>
            <li className="aries-footer__list-item"><a href="/products" className="aries-footer__link">Products</a></li>
            <li className="aries-footer__list-item"><a href="/faq" className="aries-footer__link">FAQ</a></li>
            <li className="aries-footer__list-item"><a href="/contact" className="aries-footer__link">Contact</a></li>
          </ul>
        </div>
        <div className="aries-footer__section aries-footer__contact-section">
          <h3 className="aries-footer__heading">Contact Us</h3>
          <p className="aries-footer__contact-info"><MdEmail className="aries-footer__icon" /> info@aries-fashion.com</p>
          <p className="aries-footer__contact-info"><MdPhone className="aries-footer__icon" /> +234 706 118-8005</p>
        </div>
        <div className="aries-footer__section aries-footer__social-section">
          <h3 className="aries-footer__heading">Follow Us</h3>
          <div className="aries-footer__social-icons">
            <a href="#" className="aries-footer__social-link"><FaFacebookF /></a>
            <a href="#" className="aries-footer__social-link"><FaTwitter /></a>
            <a href="#" className="aries-footer__social-link"><FaInstagram /></a>
            <a href="#" className="aries-footer__social-link"><FaPinterestP /></a>
          </div>
        </div>
      </div>
      <div className="aries-footer__bottom">
        <p className="aries-footer__copyright">&copy; 2024 Aries Fashion. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;