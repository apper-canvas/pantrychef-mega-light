import { AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { motion } from 'framer-motion';

const IngredientSearchInput = ({ searchTerm, onSearchChange, suggestions, onAddIngredient }) => {
  return (
    <div>
      <Input
        type="text"
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Search ingredients..."
        icon={ApperIcon}
        iconName="Search" // Custom prop to pass to ApperIcon
      />
      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 absolute w-[calc(100%-48px)] lg:w-[calc(25%-48px)] max-w-sm"
          >
            {suggestions.map((ingredient, index) => (
              <motion.button
                key={ingredient.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onAddIngredient(ingredient)}
                className="w-full px-4 py-2 text-left hover:bg-surface transition-colors first:rounded-t-lg last:rounded-b-lg"
              >
                <span className="font-medium">{ingredient.name}</span>
                <span className="text-sm text-gray-500 ml-2">({ingredient.category})</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

IngredientSearchInput.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  suggestions: PropTypes.array.isRequired,
  onAddIngredient: PropTypes.func.isRequired,
};

export default IngredientSearchInput;