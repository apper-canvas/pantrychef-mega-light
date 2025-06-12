import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { recipeService } from '@/services';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const favoriteRecipes = await recipeService.getFavorites();
      setFavorites(favoriteRecipes);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (recipeId) => {
    try {
      await recipeService.toggleFavorite(recipeId);
      await loadFavorites(); // Refresh the list
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your favorites...</p>
          </div>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center max-w-md mx-auto">
          <ApperIcon name="Heart" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-heading font-bold text-secondary mb-2">No Favorites Yet</h2>
          <p className="text-gray-600 mb-6">
            Start exploring recipes and save your favorites by clicking the heart icon.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ApperIcon name="ChefHat" className="w-5 h-5 mr-2" />
            Find Recipes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-secondary mb-2">My Favorites</h1>
        <p className="text-gray-600">
          {favorites.length} recipe{favorites.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((recipe) => (
          <motion.div
            key={recipe.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200"
          >
            <div className="relative">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-48 object-cover"
              />
              <button
                onClick={() => toggleFavorite(recipe.id)}
                className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
              >
                <ApperIcon 
                  name="Heart" 
                  className="w-5 h-5 text-red-500 fill-current" 
                />
              </button>
            </div>
            
            <div className="p-4">
              <h3 className="font-heading font-semibold text-lg text-secondary mb-2 line-clamp-2">
                {recipe.title}
              </h3>
              
              <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                <div className="flex items-center">
                  <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
                  {recipe.prepTime + recipe.cookTime} min
                </div>
                <div className="flex items-center">
                  <ApperIcon name="Users" className="w-4 h-4 mr-1" />
                  {recipe.servings} servings
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <ApperIcon name="ChefHat" className="w-4 h-4 mr-1" />
                  {recipe.difficulty}
                </div>
                
                <Link
                  to={`/recipe/${recipe.id}`}
                  className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors"
                >
                  View Recipe
                  <ApperIcon name="ArrowRight" className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;