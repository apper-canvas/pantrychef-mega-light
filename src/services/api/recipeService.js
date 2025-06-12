import recipesData from '../mockData/recipes.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// Get favorites from localStorage
const getFavoritesFromStorage = () => {
  try {
    const favorites = localStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error reading favorites from localStorage:', error);
    return [];
  }
};

// Save favorites to localStorage
const saveFavoritesToStorage = (favorites) => {
  try {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
  }
};

export const recipeService = {
  async getAll() {
    await delay(300);
    return [...recipesData];
  },

async getById(id) {
    await delay(200);
    
    if (!id) {
      throw new Error('Recipe ID is required');
    }
    
    // Ensure consistent string comparison since JSON IDs are strings
    const recipe = recipesData.find(r => r.id === String(id));
    if (!recipe) {
      throw new Error(`Recipe with ID ${id} not found`);
    }
    
    return { ...recipe };
  },

  async search(query, filters = {}) {
    await delay(400);
    let results = [...recipesData];

    // Filter by search query
    if (query) {
      const searchTerm = query.toLowerCase();
      results = results.filter(recipe =>
        recipe.title.toLowerCase().includes(searchTerm) ||
        recipe.ingredients.some(ingredient =>
          ingredient.name.toLowerCase().includes(searchTerm)
        ) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Filter by difficulty
    if (filters.difficulty && filters.difficulty !== 'all') {
      results = results.filter(recipe => 
        recipe.difficulty.toLowerCase() === filters.difficulty.toLowerCase()
      );
    }

    // Filter by cooking time
    if (filters.maxTime) {
      results = results.filter(recipe => 
        (recipe.prepTime + recipe.cookTime) <= parseInt(filters.maxTime)
      );
    }

    // Filter by dietary restrictions
    if (filters.dietary && filters.dietary !== 'all') {
      results = results.filter(recipe =>
        recipe.tags.some(tag => 
          tag.toLowerCase() === filters.dietary.toLowerCase()
        )
      );
    }

    return results;
  },

async getFavorites() {
    await delay(200);
    const favoriteIds = getFavoritesFromStorage();
    const favoriteRecipes = recipesData.filter(recipe => 
      favoriteIds.includes(String(recipe.id))
    );
    return favoriteRecipes.map(recipe => ({ ...recipe }));
  },

async toggleFavorite(recipeId) {
    await delay(100);
    
    if (!recipeId) {
      throw new Error('Recipe ID is required');
    }
    
    const favorites = getFavoritesFromStorage();
    const recipeIdStr = String(recipeId);
    
    if (favorites.includes(recipeIdStr)) {
      // Remove from favorites
      const newFavorites = favorites.filter(id => id !== recipeIdStr);
      saveFavoritesToStorage(newFavorites);
      return false;
    } else {
      // Add to favorites
      const newFavorites = [...favorites, recipeIdStr];
      saveFavoritesToStorage(newFavorites);
      return true;
    }
  },

  async isFavorite(recipeId) {
    if (!recipeId) return false;
    
    const favorites = getFavoritesFromStorage();
    return favorites.includes(String(recipeId));
  },

  async findByIngredients(ingredientIds, filters = {}) {
    await delay(400);
    
    if (!ingredientIds || ingredientIds.length === 0) {
      return [];
    }
    
    let filteredRecipes = [...recipesData];

    // Filter by ingredients and calculate match percentage
    filteredRecipes = filteredRecipes.map(recipe => {
      const recipeIngredientIds = recipe.ingredients?.map(ing => ing.ingredientId) || [];
      const matchingIngredients = ingredientIds.filter(id => 
        recipeIngredientIds.includes(id)
      );
      const matchPercentage = recipeIngredientIds.length > 0 
        ? Math.round((matchingIngredients.length / recipeIngredientIds.length) * 100)
        : 0;
      
      return {
        ...recipe,
        matchPercentage
      };
    }).filter(recipe => recipe.matchPercentage > 0);

    // Apply dietary filters
    if (filters.dietary && filters.dietary.length > 0) {
      filteredRecipes = filteredRecipes.filter(recipe =>
        recipe.tags && filters.dietary.every(diet => recipe.tags.includes(diet))
      );
    }

    // Apply cook time filter
    if (filters.cookTime) {
      filteredRecipes = filteredRecipes.filter(recipe => {
        const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);
        if (filters.cookTime === 15) return totalTime <= 15;
        if (filters.cookTime === 30) return totalTime <= 30;
        if (filters.cookTime === 60) return totalTime >= 60;
        return true;
      });
    }

    // Sort by match percentage (highest first)
    filteredRecipes.sort((a, b) => b.matchPercentage - a.matchPercentage);

    return filteredRecipes;
  }
};