import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { shoppingService } from '../services';

const ShoppingList = () => {
  const [shoppingItems, setShoppingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadShoppingList();
  }, []);

  const loadShoppingList = async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await shoppingService.getAll();
      setShoppingItems(items);
    } catch (err) {
      setError(err.message || 'Failed to load shopping list');
      toast.error('Failed to load shopping list');
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = async (itemId) => {
    try {
      const item = shoppingItems.find(i => i.id === itemId);
      const updatedItem = await shoppingService.update(itemId, {
        ...item,
        checked: !item.checked
      });
      
      setShoppingItems(prev => 
        prev.map(item => item.id === itemId ? updatedItem : item)
      );
      
      toast.success(updatedItem.checked ? 'Item checked off' : 'Item unchecked');
    } catch (error) {
      toast.error('Failed to update item');
      console.error('Update error:', error);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await shoppingService.delete(itemId);
      setShoppingItems(prev => prev.filter(item => item.id !== itemId));
      toast.success('Item removed from shopping list');
    } catch (error) {
      toast.error('Failed to remove item');
      console.error('Delete error:', error);
    }
  };

  const clearCompleted = async () => {
    try {
      const completedItems = shoppingItems.filter(item => item.checked);
      for (const item of completedItems) {
        await shoppingService.delete(item.id);
      }
      setShoppingItems(prev => prev.filter(item => !item.checked));
      toast.success('Completed items cleared');
    } catch (error) {
      toast.error('Failed to clear completed items');
      console.error('Clear error:', error);
    }
  };

  const clearAll = async () => {
    try {
      for (const item of shoppingItems) {
        await shoppingService.delete(item.id);
      }
      setShoppingItems([]);
      toast.success('Shopping list cleared');
    } catch (error) {
      toast.error('Failed to clear shopping list');
      console.error('Clear all error:', error);
    }
  };

  // Group items by category
  const groupedItems = shoppingItems.reduce((groups, item) => {
    const category = item.category || 'Other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});

  const categories = Object.keys(groupedItems).sort();
  const completedCount = shoppingItems.filter(item => item.checked).length;
  const totalCount = shoppingItems.length;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8" />
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-lg">
                <div className="w-6 h-6 bg-gray-200 rounded-full" />
                <div className="flex-1 h-4 bg-gray-200 rounded" />
                <div className="w-8 h-8 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <ApperIcon name="AlertTriangle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-secondary mb-2">Failed to load shopping list</h3>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={loadShoppingList}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (shoppingItems.length === 0) {
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
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Find Recipes
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-secondary mb-2">
            Shopping List
          </h1>
          <p className="text-gray-600">
            {completedCount} of {totalCount} items completed
          </p>
        </div>
        
        <div className="flex gap-3">
          {completedCount > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearCompleted}
              className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg font-medium hover:bg-success/90 transition-colors"
            >
              <ApperIcon name="CheckCheck" className="w-4 h-4" />
              Clear Completed
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 bg-error text-white rounded-lg font-medium hover:bg-error/90 transition-colors"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
            Clear All
          </motion.button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{Math.round((completedCount / totalCount) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(completedCount / totalCount) * 100}%` }}
            className="bg-success h-2 rounded-full transition-all duration-500"
          />
        </div>
      </div>

      {/* Shopping Items by Category */}
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
                  name={category === 'Produce' ? 'Apple' : 
                        category === 'Dairy' ? 'Milk' :
                        category === 'Meat' ? 'Beef' :
                        category === 'Pantry' ? 'Package' : 'ShoppingBag'} 
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
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${
                      item.checked ? 'opacity-60' : ''
                    }`}
                  >
                    <button
                      onClick={() => toggleItem(item.id)}
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        item.checked
                          ? 'bg-success border-success text-white'
                          : 'border-gray-300 hover:border-primary'
                      }`}
                    >
                      {item.checked && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", duration: 0.3 }}
                        >
                          <ApperIcon name="Check" className="w-3 h-3" />
                        </motion.div>
                      )}
                    </button>
                    
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
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-gray-400 hover:text-error transition-colors"
                    >
                      <ApperIcon name="X" className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ShoppingList;