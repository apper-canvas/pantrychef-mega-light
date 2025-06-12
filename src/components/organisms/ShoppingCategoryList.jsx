import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import ApperIcon from '@/components/ApperIcon';
import ShoppingListItem from '@/components/molecules/ShoppingListItem';

const ShoppingCategoryList = ({ groupedItems, onToggleItem, onRemoveItem }) => {
  const categories = Object.keys(groupedItems).sort();

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Produce': return 'Apple';
      case 'Dairy': return 'Milk';
      case 'Meat': return 'Beef';
      case 'Pantry': return 'Package';
      default: return 'ShoppingBag';
    }
  };

  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border overflow-hidden"
        >
          <div className="bg-surface px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-secondary flex items-center gap-2">
              <ApperIcon 
                name={getCategoryIcon(category)} 
                className="w-5 h-5 text-primary" 
              />
              {category}
              <span className="text-sm text-gray-500 ml-2">
                ({groupedItems[category].length} items)
              </span>
            </h3>
          </div>
          
          <div className="divide-y divide-gray-100">
            <AnimatePresence>
              {groupedItems[category].map((item, index) => (
                <ShoppingListItem
                  key={item.id}
                  item={item}
                  onToggle={onToggleItem}
                  onRemove={onRemoveItem}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

ShoppingCategoryList.propTypes = {
  groupedItems: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
  onToggleItem: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
};

export default ShoppingCategoryList;