import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import ShoppingListSummary from '@/components/organisms/ShoppingListSummary';
import ShoppingListControls from '@/components/organisms/ShoppingListControls';
import ShoppingCategoryList from '@/components/organisms/ShoppingCategoryList';
import ShoppingListLoadingState from '@/components/organisms/ShoppingListLoadingState';
import ShoppingListEmptyState from '@/components/organisms/ShoppingListEmptyState';

import { shoppingService } from '@/services';

const ShoppingListPage = () => {
  const navigate = useNavigate();
  const [shoppingItems, setShoppingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadShoppingList = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadShoppingList();
  }, [loadShoppingList]);

  const toggleItem = useCallback(async (itemId) => {
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
  }, [shoppingItems]);

  const removeItem = useCallback(async (itemId) => {
    try {
      await shoppingService.delete(itemId);
      setShoppingItems(prev => prev.filter(item => item.id !== itemId));
      toast.success('Item removed from shopping list');
    } catch (error) {
      toast.error('Failed to remove item');
      console.error('Delete error:', error);
    }
  }, []);

  const clearCompleted = useCallback(async () => {
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
  }, [shoppingItems]);

  const clearAll = useCallback(async () => {
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
  }, [shoppingItems]);

  // Group items by category
  const groupedItems = shoppingItems.reduce((groups, item) => {
    const category = item.category || 'Other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});

  const completedCount = shoppingItems.filter(item => item.checked).length;
  const totalCount = shoppingItems.length;

  if (loading) {
    return <ShoppingListLoadingState />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <ApperIcon name="AlertTriangle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-secondary mb-2">Failed to load shopping list</h3>
          <p className="text-gray-600 mb-8">{error}</p>
          <Button
            onClick={loadShoppingList}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (shoppingItems.length === 0) {
    return <ShoppingListEmptyState onFindRecipes={() => navigate('/')} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Header and Controls */}
      <div className="flex justify-between items-start mb-8">
        <ShoppingListSummary completedCount={completedCount} totalCount={totalCount} />
        <ShoppingListControls
          completedCount={completedCount}
          onClearCompleted={clearCompleted}
          onClearAll={clearAll}
        />
      </div>

      {/* Shopping Items by Category */}
      <ShoppingCategoryList
        groupedItems={groupedItems}
        onToggleItem={toggleItem}
        onRemoveItem={removeItem}
      />
    </motion.div>
  );
};

export default ShoppingListPage;