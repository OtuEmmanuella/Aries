import React, { useState, useEffect } from 'react';
import { auth, db } from '../../Firebase/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { FaArrowLeft, FaUser, FaCalendar, FaShoppingBag } from 'react-icons/fa';
import './Auth-styles.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          const newUserData = {
            email: user.email,
            createdAt: new Date(),
            orderHistory: []
          };
          await setDoc(doc(db, 'users', user.uid), newUserData);
          setUserData(newUserData);
        }
      } else {
        navigate('/login');
      }
    });
    
    return () => unsubscribe();
  }, [navigate]);

  const handleBackClick = () => {
    navigate(-1);
  };

  if (!user || !userData) {
    return (
      <div className="auth-container">
        <ClipLoader size={50} color={"#111"} loading={true} />
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-form user-profile">
        <button onClick={handleBackClick} className="auth-button back-button">
          <FaArrowLeft className="button-icon" /> Back
        </button>
        
        <h2 className="auth-title">YOUR ARIES ACCOUNT</h2>
        
        <div className="user-info">
          <div className="info-item">
            <FaUser className="info-icon" />
            <p><strong>Email:</strong> {userData.email}</p>
          </div>
          <div className="info-item">
            <FaCalendar className="info-icon" />
            <p><strong>Member since:</strong> {userData.createdAt.toDate().toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="order-history">
          <h3 className="section-title">
            <FaShoppingBag className="section-icon" />
            Order History
          </h3>
          {userData.orderHistory.length > 0 ? (
            <ul className="order-list">
              {userData.orderHistory.map((order, index) => (
                <li key={index} className="order-item">
                  <p className="order-id">Order #{order.id}</p>
                  <p className="order-date">{order.date.toDate().toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-orders">No orders yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;