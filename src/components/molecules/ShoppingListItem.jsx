import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import Checkbox from '@/components/atoms/Checkbox';
import ApperIcon from '@/components/ApperIcon';

const ShoppingListItem = ({ item, onToggle, onRemove, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.05 }}
      className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${
        item.checked ? 'opacity-60' : ''
      }`}
    >
      <Checkbox checked={item.checked} onClick={() => onToggle(item.id)} />
      
      <div className={`flex-1 ${item.checked ? 'line-through' : ''}`}>
        <div className="font-medium text-secondary">
          {item.quantity} {item.unit} {item.name}
        </div>
        {item.recipeIds && item.recipeIds.length > 0 && (
          <div className="text-sm text-gray-500">
            For {item.recipeIds.length} recipe{item.recipeIds.length > 1 ? 's' : ''}
          </div>
        )}
      </div>
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onRemove(item.id)}
        className="p-2 text-gray-400 hover:text-error transition-colors"
      >
        <ApperIcon name="X" className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
};

ShoppingListItem.propTypes = {
  item: PropTypes.object.isRequired,
  onToggle: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

export default ShoppingListItem;