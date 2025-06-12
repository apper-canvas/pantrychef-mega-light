import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2, delay: 1 }}
        >
          <ApperIcon name="ChefHat" className="w-24 h-24 text-primary mx-auto mb-8" />
        </motion.div>
        
        <h1 className="text-6xl font-heading font-bold text-secondary mb-4">404</h1>
        <h2 className="text-2xl font-heading font-semibold text-secondary mb-4">
          Recipe Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          Looks like this recipe wandered off the menu! Let's get you back to cooking.
        </p>
        
        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Back to Recipe Finder
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="w-full px-6 py-3 bg-surface text-secondary rounded-lg font-medium hover:bg-surface/80 transition-colors"
          >
            Go Back
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;