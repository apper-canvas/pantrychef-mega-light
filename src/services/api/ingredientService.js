import { delay } from '../index';
import ingredientsData from '../mockData/ingredients.json';

class IngredientService {
  constructor() {
    this.ingredients = [...ingredientsData];
  }

  async getAll() {
    await delay(200);
    return [...this.ingredients];
  }

  async getById(id) {
    await delay(200);
    const ingredient = this.ingredients.find(item => item.id === id);
    if (!ingredient) {
      throw new Error('Ingredient not found');
    }
    return { ...ingredient };
  }

  async search(term) {
    await delay(300);
    const filtered = this.ingredients.filter(ingredient =>
      ingredient.name.toLowerCase().includes(term.toLowerCase()) ||
      ingredient.category.toLowerCase().includes(term.toLowerCase())
    );
    return [...filtered];
  }

  async create(ingredient) {
    await delay(300);
    const newIngredient = {
      ...ingredient,
      id: Date.now().toString()
    };
    this.ingredients.push(newIngredient);
    return { ...newIngredient };
  }

  async update(id, data) {
    await delay(300);
    const index = this.ingredients.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Ingredient not found');
    }
    this.ingredients[index] = { ...this.ingredients[index], ...data };
    return { ...this.ingredients[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.ingredients.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Ingredient not found');
    }
    this.ingredients.splice(index, 1);
    return true;
  }
}

export const ingredientService = new IngredientService();