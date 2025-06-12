import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

import RecipeOverview from '@/components/organisms/RecipeOverview';
import RecipeIngredientsList from '@/components/organisms/RecipeIngredientsList';
import RecipeInstructionsList from '@/components/organisms/RecipeInstructionsList';
import RecipeDetailLoadingState from '@/components/organisms/RecipeDetailLoadingState';
import RecipeDetailErrorState from '@/components/organisms/RecipeDetailErrorState';

import { recipeService, shoppingService } from '@/services';

const RecipeDetailPage = () => {
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
        const recipeData = await recipeService.getById(id);
        setRecipe(recipeData);
      } catch (err) {
        setError(err.message || 'Failed to load recipe');
        toast.error('Failed to load recipe');
      } finally {
        setLoading(false);
      }
    };
    loadRecipe();
  }, [id]);

  const toggleIngredientCheck = useCallback((ingredientId) => {
    setCheckedIngredients(prev => {
      const newSet = new Set(prev);
      if (newSet.has(ingredientId)) {
        newSet.delete(ingredientId);
      } else {
        newSet.add(ingredientId);
      }
      return newSet;
    });
  }, []);

  const addMissingToShoppingList = useCallback(async () => {
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
  }, [recipe, checkedIngredients, navigate]);

  if (loading) {
    return <RecipeDetailLoadingState />;
  }

  if (error || !recipe) {
    return <RecipeDetailErrorState message={error || 'Recipe data is unavailable.'} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <RecipeOverview recipe={recipe} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <RecipeIngredientsList
          ingredients={recipe.ingredients}
          checkedIngredients={checkedIngredients}
          onToggleIngredientCheck={toggleIngredientCheck}
          onAddMissingToShoppingList={addMissingToShoppingList}
        />
        <RecipeInstructionsList instructions={recipe.instructions} />
      </div>
    </motion.div>
  );
};

export default RecipeDetailPage;