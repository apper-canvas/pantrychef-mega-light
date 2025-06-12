import { delay } from '../index';
import recipesData from '../mockData/recipes.json';

class RecipeService {
  constructor() {
    this.recipes = [...recipesData];
  }

  async getAll() {
    await delay(300);
    return [...this.recipes];
  }

  async getById(id) {
    await delay(300);
    const recipe = this.recipes.find(item => item.id === id);
    if (!recipe) {
      throw new Error('Recipe not found');
    }
    return { ...recipe };
  }

  async findByIngredients(ingredientIds, filters = {}) {
    await delay(400);
    
    let filteredRecipes = [...this.recipes];

    // Filter by ingredients and calculate match percentage
    filteredRecipes = filteredRecipes.map(recipe => {
      const recipeIngredientIds = recipe.ingredients.map(ing => ing.ingredientId);
      const matchingIngredients = ingredientIds.filter(id => 
        recipeIngredientIds.includes(id)
      );
      const matchPercentage = Math.round(
        (matchingIngredients.length / recipeIngredientIds.length) * 100
      );
      
      return {
        ...recipe,
        matchPercentage
      };
    }).filter(recipe => recipe.matchPercentage > 0); // Only show recipes with at least one matching ingredient

    // Apply dietary filters
    if (filters.dietary && filters.dietary.length > 0) {
      filteredRecipes = filteredRecipes.filter(recipe =>
        filters.dietary.every(diet => recipe.tags.includes(diet))
      );
    }

    // Apply cook time filter
    if (filters.cookTime) {
      filteredRecipes = filteredRecipes.filter(recipe => {
        const totalTime = recipe.prepTime + recipe.cookTime;
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

  async create(recipe) {
    await delay(300);
    const newRecipe = {
      ...recipe,
      id: Date.now().toString()
    };
    this.recipes.push(newRecipe);
    return { ...newRecipe };
  }

  async update(id, data) {
    await delay(300);
    const index = this.recipes.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Recipe not found');
    }
    this.recipes[index] = { ...this.recipes[index], ...data };
    return { ...this.recipes[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.recipes.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Recipe not found');
    }
    this.recipes.splice(index, 1);
    return true;
  }
}

export const recipeService = new RecipeService();