import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ShoppingListEmptyState = ({ onFindRecipes }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center py-16">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <ApperIcon name="ShoppingCart" className="w-24 h-24 text-gray-300 mx-auto mb-6" />
        </motion.div>
        <h3 className="text-2xl font-heading font-semibold text-secondary mb-4">
          Your shopping list is empty
        </h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Browse recipes and add missing ingredients to your shopping list to get started.
        </p>
        <Button
          onClick={onFindRecipes}
          className="bg-primary text-white hover:bg-primary/90"
        >
          Find Recipes
        </Button>
      </div>
    </div>
  );
};

ShoppingListEmptyState.propTypes = {
  onFindRecipes: PropTypes.func.isRequired,
};

export default ShoppingListEmptyState;