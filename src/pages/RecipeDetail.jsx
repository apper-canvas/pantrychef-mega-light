import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import { recipeService, shoppingService } from '@/services'

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkedIngredients, setCheckedIngredients] = useState(new Set());

useEffect(() => {
    const loadRecipe = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!id) {
          throw new Error('Recipe ID is required');
        }
        const recipeData = await recipeService.getById(id);
        if (!recipeData) {
          throw new Error('Recipe not found');
        }
        setRecipe(recipeData);
      } catch (err) {
        const errorMessage = err.message || 'Failed to load recipe';
        setError(errorMessage);
        toast.error(errorMessage);
        console.error('Recipe loading error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      loadRecipe();
    } else {
      setError('Invalid recipe ID');
      setLoading(false);
    }
  }, [id]);

  const toggleIngredientCheck = (ingredientId) => {
    setCheckedIngredients(prev => {
      const newSet = new Set(prev);
      if (newSet.has(ingredientId)) {
        newSet.delete(ingredientId);
      } else {
        newSet.add(ingredientId);
      }
      return newSet;
    });
  };

  const addMissingToShoppingList = async () => {
    if (!recipe) return;
    
    try {
      const missingIngredients = recipe.ingredients.filter(ingredient => 
        !checkedIngredients.has(ingredient.ingredientId)
      );

      for (const ingredient of missingIngredients) {
        await shoppingService.addItem({
          ingredientId: ingredient.ingredientId,
          name: ingredient.name,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          recipeIds: [recipe.id]
        });
      }

      toast.success(`Added ${missingIngredients.length} ingredients to shopping list`);
      navigate('/shopping');
    } catch (error) {
      toast.error('Failed to add ingredients to shopping list');
      console.error('Shopping list error:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
          <div className="h-64 bg-gray-200 rounded-xl mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded" />
              ))}
            </div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded" />
              ))}
            </div>
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
          <h3 className="text-xl font-semibold text-secondary mb-2">Recipe not found</h3>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Back to Recipes
          </button>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <ApperIcon name="Search" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-secondary mb-2">Recipe not found</h3>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Back to Recipes
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-secondary hover:text-primary mb-6 transition-colors"
      >
        <ApperIcon name="ArrowLeft" className="w-4 h-4" />
        Back to recipes
      </button>

      {/* Recipe Header */}
      <div className="relative h-80 rounded-2xl overflow-hidden mb-8">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-primary font-semibold">
                {recipe.matchPercentage}% match
              </span>
            </div>
            {recipe.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-4xl font-heading font-bold text-white mb-4">
            {recipe.title}
          </h1>
          <div className="flex items-center gap-6 text-white/90">
            <div className="flex items-center gap-2">
              <ApperIcon name="Clock" className="w-5 h-5" />
              <span>Prep: {recipe.prepTime} min</span>
            </div>
            <div className="flex items-center gap-2">
              <ApperIcon name="ChefHat" className="w-5 h-5" />
              <span>Cook: {recipe.cookTime} min</span>
            </div>
            <div className="flex items-center gap-2">
              <ApperIcon name="Users" className="w-5 h-5" />
              <span>{recipe.servings} servings</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ingredients */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-heading font-semibold text-secondary">
                Ingredients
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addMissingToShoppingList}
                className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <ApperIcon name="ShoppingCart" className="w-4 h-4" />
                Add Missing
              </motion.button>
            </div>

            <div className="space-y-3">
              {recipe.ingredients.map((ingredient, index) => (
                <motion.div
                  key={ingredient.ingredientId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <button
                    onClick={() => toggleIngredientCheck(ingredient.ingredientId)}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      checkedIngredients.has(ingredient.ingredientId)
                        ? 'bg-success border-success text-white'
                        : 'border-gray-300 hover:border-primary'
                    }`}
                  >
                    {checkedIngredients.has(ingredient.ingredientId) && (
                      <ApperIcon name="Check" className="w-3 h-3" />
                    )}
                  </button>
                  <div className={`flex-1 ${
                    checkedIngredients.has(ingredient.ingredientId) 
                      ? 'line-through text-gray-500' 
                      : ''
                  }`}>
                    <span className="font-medium">
                      {ingredient.quantity} {ingredient.unit}
                    </span>
                    <span className="ml-2">{ingredient.name}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border p-8">
            <h2 className="text-2xl font-heading font-semibold text-secondary mb-8">
              Instructions
            </h2>

            <div className="space-y-6">
              {recipe.instructions.map((instruction, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 leading-relaxed">{instruction}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RecipeDetail;