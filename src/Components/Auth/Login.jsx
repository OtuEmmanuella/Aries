import React, { useState } from 'react';
import { auth } from '../../Firebase/firebaseConfig';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import './Auth-styles.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2 className="auth-title">Login</h2>
        {error && <p className="auth-error">{error}</p>}
        <input
          type="email"
          className="auth-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="auth-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="auth-button">Login</button>
        
        <div className="auth-divider">
          <span>or</span>
        </div>
        
        <button type="button" className="auth-button google-button" onClick={handleGoogleLogin}>
          <FcGoogle className="google-icon" /> Sign in with Google
        </button>
        
        <div className="auth-links">
          <Link to="/signup" className="auth-link">Don't have an account? Sign up</Link>
          <Link to="/forgot-password" className="auth-link">Forgot Password?</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;