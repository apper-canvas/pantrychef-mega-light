import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import PantrySection from '@/components/organisms/PantrySection';
import RecipeFilterSection from '@/components/organisms/RecipeFilterSection';
import RecipeResultsDisplay from '@/components/organisms/RecipeResultsDisplay';

import { ingredientService, recipeService, shoppingService } from '@/services';

const HomePage = () => {
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

  // Load recipes when pantry ingredients or filters change
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Ingredients and Filters */}
        <div className="lg:col-span-1 space-y-6">
          <PantrySection
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            suggestions={suggestions}
            pantryIngredients={pantryIngredients}
            onAddIngredient={addIngredient}
            onRemoveIngredient={removeIngredient}
          />
          <RecipeFilterSection
            filters={filters}
            onToggleDietaryFilter={toggleDietaryFilter}
            onSetCookTimeFilter={setCookTimeFilter}
          />
        </div>

        {/* Main Content - Recipe Results */}
        <div className="lg:col-span-3">
          <RecipeResultsDisplay
            loading={loading}
            recipes={recipes}
            onAddToShoppingList={addToShoppingList}
            onNavigateToRecipe={(recipeId) => navigate(`/recipe/${recipeId}`)}
            onNavigateToShoppingList={() => navigate('/shopping')}
            pantryIngredientsCount={pantryIngredients.length}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default HomePage;