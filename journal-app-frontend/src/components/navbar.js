import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <Link to="/journal">
            <motion.div 
              className="pie-logo small"
              whileHover={{ rotate: 30 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="pie-slice"></div>
            </motion.div>
            <span>Therapie</span>
          </Link>
        </div>
        
        <div className="nav-menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        <motion.div 
          className={`nav-links ${menuOpen ? 'active' : ''}`}
          initial={false}
          animate={menuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
        >
          <Link 
            to="/journal" 
            className={location.pathname === '/journal' ? 'active' : ''}
            onClick={() => setMenuOpen(false)}
          >
            Journal
          </Link>
          <Link 
            to="/insights" 
            className={location.pathname === '/insights' ? 'active' : ''}
            onClick={() => setMenuOpen(false)}
          >
            Insights
          </Link>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </motion.div>
      </div>
    </nav>
  );
};

export default Navbar;