import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import RecipeCard from '@/components/molecules/RecipeCard';

const RecipeResultsDisplay = ({ loading, recipes, onAddToShoppingList, onNavigateToRecipe, onNavigateToShoppingList, pantryIngredientsCount }) => {
  const navigate = useNavigate();

  if (pantryIngredientsCount === 0) {
    return (
      <div className="text-center py-16">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <ApperIcon name="ChefHat" className="w-24 h-24 text-gray-300 mx-auto mb-6" />
        </motion.div>
        <h3 className="text-2xl font-heading font-semibold text-secondary mb-4">
          Start by adding ingredients
        </h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Tell us what you have in your pantry, and we'll find delicious recipes you can make right now.
        </p>
        <Button
          onClick={() => document.querySelector('input').focus()}
          className="bg-primary text-white hover:bg-primary/90"
        >
          Add Your First Ingredient
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl shadow-sm border overflow-hidden"
          >
            <div className="h-48 bg-gray-200 animate-pulse" />
            <div className="p-6">
              <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4 animate-pulse" />
              <div className="flex justify-between items-center">
                <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-12 animate-pulse" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-16">
        <ApperIcon name="Search" className="w-24 h-24 text-gray-300 mx-auto mb-6" />
        <h3 className="text-2xl font-heading font-semibold text-secondary mb-4">
          No recipes found
        </h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Try adding more ingredients or adjusting your filters to find recipes.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-heading font-bold text-secondary">
          Recipe Suggestions ({recipes.length})
        </h2>
        <Button
          onClick={onNavigateToShoppingList}
          className="flex items-center gap-2 px-4 py-2 bg-surface text-secondary hover:bg-surface/80"
        >
          <ApperIcon name="ShoppingCart" className="w-4 h-4" />
          View Shopping List
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {recipes.map((recipe, index) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onClick={onNavigateToRecipe}
            onAddToShoppingList={onAddToShoppingList}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

RecipeResultsDisplay.propTypes = {
  loading: PropTypes.bool.isRequired,
  recipes: PropTypes.array.isRequired,
  onAddToShoppingList: PropTypes.func.isRequired,
  onNavigateToRecipe: PropTypes.func.isRequired,
  onNavigateToShoppingList: PropTypes.func.isRequired,
  pantryIngredientsCount: PropTypes.number.isRequired,
};

export default RecipeResultsDisplay;