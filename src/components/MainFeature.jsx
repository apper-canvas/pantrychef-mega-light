import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ApperIcon from './ApperIcon';
import { ingredientService, recipeService, shoppingService } from '../services';

const MainFeature = () => {
  const navigate = useNavigate();
  const [pantryIngredients, setPantryIngredients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    dietary: [],
    cookTime: null
  });
  const [availableIngredients, setAvailableIngredients] = useState([]);

  // Load available ingredients for autocomplete
  useEffect(() => {
    const loadIngredients = async () => {
      try {
        const ingredients = await ingredientService.getAll();
        setAvailableIngredients(ingredients);
      } catch (error) {
        console.error('Failed to load ingredients:', error);
      }
    };
    loadIngredients();
  }, []);

  // Update suggestions based on search term
  useEffect(() => {
    if (searchTerm.length > 1) {
      const filtered = availableIngredients
        .filter(ingredient => 
          ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !pantryIngredients.find(p => p.id === ingredient.id)
        )
        .slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, availableIngredients, pantryIngredients]);

  // Load recipes when pantry ingredients change
  useEffect(() => {
    if (pantryIngredients.length > 0) {
      findRecipes();
    } else {
      setRecipes([]);
    }
  }, [pantryIngredients, filters]);

  const findRecipes = async () => {
    setLoading(true);
    try {
      const ingredientIds = pantryIngredients.map(ing => ing.id);
      const foundRecipes = await recipeService.findByIngredients(ingredientIds, filters);
      setRecipes(foundRecipes);
    } catch (error) {
      toast.error('Failed to find recipes');
      console.error('Recipe search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addIngredient = (ingredient) => {
    setPantryIngredients(prev => [...prev, ingredient]);
    setSearchTerm('');
    setSuggestions([]);
    toast.success(`Added ${ingredient.name} to your pantry`);
  };

  const removeIngredient = (ingredientId) => {
    setPantryIngredients(prev => prev.filter(ing => ing.id !== ingredientId));
  };

  const toggleDietaryFilter = (filter) => {
    setFilters(prev => ({
      ...prev,
      dietary: prev.dietary.includes(filter)
        ? prev.dietary.filter(f => f !== filter)
        : [...prev.dietary, filter]
    }));
  };

  const setCookTimeFilter = (time) => {
    setFilters(prev => ({ ...prev, cookTime: time }));
  };

  const addToShoppingList = async (recipe) => {
    try {
      const missingIngredients = recipe.ingredients.filter(ingredient => 
        !pantryIngredients.find(p => p.id === ingredient.ingredientId)
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
    } catch (error) {
      toast.error('Failed to add ingredients to shopping list');
      console.error('Shopping list error:', error);
    }
  };

  const dietaryOptions = [
    { id: 'vegetarian', label: 'Vegetarian', icon: 'Leaf' },
    { id: 'vegan', label: 'Vegan', icon: 'Sprout' },
    { id: 'gluten-free', label: 'Gluten-Free', icon: 'WheatOff' },
    { id: 'low-carb', label: 'Low Carb', icon: 'TrendingDown' }
  ];

  const cookTimeOptions = [
    { id: 15, label: '15 min', icon: 'Clock3' },
    { id: 30, label: '30 min', icon: 'Clock6' },
    { id: 60, label: '60+ min', icon: 'Clock12' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Ingredients and Filters */}
        <div className="lg:col-span-1 space-y-6">
          {/* Ingredient Input */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-heading font-semibold text-secondary mb-4">
              What's in your pantry?
            </h2>
            
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search ingredients..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <ApperIcon name="Search" className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
            </div>

            {/* Suggestions */}
            <AnimatePresence>
              {suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                >
                  {suggestions.map((ingredient, index) => (
                    <motion.button
                      key={ingredient.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => addIngredient(ingredient)}
                      className="w-full px-4 py-2 text-left hover:bg-surface transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      <span className="font-medium">{ingredient.name}</span>
                      <span className="text-sm text-gray-500 ml-2">({ingredient.category})</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Selected Ingredients */}
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {pantryIngredients.map((ingredient) => (
                    <motion.div
                      key={ingredient.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      <span>{ingredient.name}</span>
                      <button
                        onClick={() => removeIngredient(ingredient.id)}
                        className="hover:bg-primary hover:text-white rounded-full p-0.5 transition-colors"
                      >
                        <ApperIcon name="X" className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-heading font-semibold text-secondary mb-4">Filters</h3>
            
            {/* Dietary Preferences */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Dietary Preferences</h4>
              <div className="space-y-2">
                {dietaryOptions.map((option) => (
                  <label key={option.id} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.dietary.includes(option.id)}
                      onChange={() => toggleDietaryFilter(option.id)}
                      className="sr-only"
                    />
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      filters.dietary.includes(option.id)
                        ? 'bg-accent text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}>
                      <ApperIcon name={option.icon} className="w-4 h-4" />
                      <span className="text-sm">{option.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Cook Time */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Cook Time</h4>
              <div className="space-y-2">
                {cookTimeOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setCookTimeFilter(filters.cookTime === option.id ? null : option.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors w-full ${
                      filters.cookTime === option.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <ApperIcon name={option.icon} className="w-4 h-4" />
                    <span className="text-sm">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Recipe Results */}
        <div className="lg:col-span-3">
          {pantryIngredients.length === 0 ? (
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
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.querySelector('input').focus()}
                className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Add Your First Ingredient
              </motion.button>
            </div>
          ) : loading ? (
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
          ) : recipes.length === 0 ? (
            <div className="text-center py-16">
              <ApperIcon name="Search" className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-heading font-semibold text-secondary mb-4">
                No recipes found
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Try adding more ingredients or adjusting your filters to find recipes.
              </p>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-heading font-bold text-secondary">
                  Recipe Suggestions ({recipes.length})
                </h2>
                <button
                  onClick={() => navigate('/shopping')}
                  className="flex items-center gap-2 px-4 py-2 bg-surface text-secondary rounded-lg hover:bg-surface/80 transition-colors"
                >
                  <ApperIcon name="ShoppingCart" className="w-4 h-4" />
                  View Shopping List
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {recipes.map((recipe, index) => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={() => navigate(`/recipe/${recipe.id}`)}
                  >
                    <div className="relative h-48">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                          <span className="text-primary font-semibold text-sm">
                            {recipe.matchPercentage}% match
                          </span>
                        </div>
                      </div>
                      <div className="absolute top-4 right-4">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            addToShoppingList(recipe);
                          }}
                          className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                        >
                          <ApperIcon name="ShoppingCart" className="w-4 h-4 text-primary" />
                        </motion.button>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-lg font-heading font-semibold text-secondary mb-2">
                        {recipe.title}
                      </h3>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <ApperIcon name="Clock" className="w-4 h-4" />
                          <span>{recipe.prepTime + recipe.cookTime} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ApperIcon name="Users" className="w-4 h-4" />
                          <span>{recipe.servings} servings</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {recipe.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainFeature;