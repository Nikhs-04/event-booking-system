import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          EventBooking
        </Link>
        <ul className="navbar-menu">
          <li><Link to="/">Events</Link></li>
          {user ? (
            <>
              <li><Link to="/my-bookings">My Bookings</Link></li>
              {user.role === 'admin' && (
                <li><Link to="/admin">Admin Dashboard</Link></li>
              )}
              <li><span className="user-name">Hi, {user.name}</span></li>
              <li><button onClick={handleLogout} className="btn-logout">Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register" className="btn-register">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;