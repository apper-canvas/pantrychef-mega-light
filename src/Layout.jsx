import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ApperIcon from '@/components/ApperIcon';
import { routes } from '@/config/routes';

const Layout = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navItems = Object.values(routes).filter(route => !route.hideFromNav);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className={`flex-shrink-0 bg-white border-b z-40 transition-shadow duration-200 ${
        scrolled ? 'shadow-md' : 'border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <ApperIcon name="ChefHat" className="w-8 h-8 text-primary mr-3" />
              <h1 className="text-2xl font-heading font-bold text-secondary">PantryChef</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navItems.map(item => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? 'text-primary bg-surface' 
                      : 'text-secondary hover:text-primary hover:bg-surface/50'
                    }
                  `}
                >
                  <ApperIcon name={item.icon} className="w-4 h-4 mr-2" />
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-surface transition-colors"
                aria-label="Toggle menu"
              >
                <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        {mobileMenuOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 md:hidden z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 bg-white border-b shadow-lg md:hidden z-50"
            >
              <nav className="px-4 py-2 space-y-1">
                {navItems.map(item => (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    className={({ isActive }) => `
                      flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200
                      ${isActive 
                        ? 'text-primary bg-surface' 
                        : 'text-secondary hover:text-primary hover:bg-surface/50'
                      }
                    `}
                  >
                    <ApperIcon name={item.icon} className="w-5 h-5 mr-3" />
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-full"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;