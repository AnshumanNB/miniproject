import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Network, Brain, Menu, X, BookOpen,} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/labs/experiment1', label: 'Computer Networks', icon: Network },
    { path: '/labs/experiment21', label: 'Theory of Computation', icon: Brain }
  ];

  return (
    <motion.nav 
      className={`navbar navbar-expand-md fixed-top ${scrolled ? 'bg-dark shadow' : 'bg-transparent'}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}
    >
      <div className="container">
        <motion.div 
          className="navbar-brand d-flex align-items-center gap-2 text-white fw-bold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/" className="d-flex align-items-center text-decoration-none text-white">
            <div 
              className="d-flex justify-content-center align-items-center rounded-3 shadow-sm" 
              style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #667eea, #764ba2)'}}
            >
              <BookOpen size={28} />
            </div>
            <span className="ms-2" style={{ background: 'linear-gradient(135deg, #fff, #e0e7ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              TechLabz
            </span>
          </Link>
        </motion.div>

        <button 
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          style={{ color: 'white' }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`collapse navbar-collapse justify-content-end ${isOpen ? 'show' : ''}`}>
          <ul className="navbar-nav gap-3">
            {navItems.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <motion.li 
                  key={path} 
                  className="nav-item"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Link to={path} onClick={() => setIsOpen(false)} 
                    className={`nav-link d-flex align-items-center gap-1 px-3 py-2 rounded-3 fw-semibold ${isActive ? 'active' : 'text-white-50'}`} 
                    style={{ transition: 'all 0.3s ease' }}
                  >
                    <Icon size={20} />
                    <span>{label}</span>
                    {isActive && (
                      <motion.div 
                        className="nav-indicator"
                        layoutId="nav-indicator"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="navbar-bg-effects d-none d-md-block">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-circle bg-circle-3"></div>
      </div>
    </motion.nav>
  );
};

export default Navbar;

