import { delay } from '../index';

class ShoppingService {
  constructor() {
    this.items = [];
  }

  async getAll() {
    await delay(300);
    return [...this.items];
  }

  async getById(id) {
    await delay(300);
    const item = this.items.find(item => item.id === id);
    if (!item) {
      throw new Error('Shopping item not found');
    }
    return { ...item };
  }

  async addItem(itemData) {
    await delay(300);
    
    // Check if item already exists
    const existingItem = this.items.find(item => 
      item.ingredientId === itemData.ingredientId
    );

    if (existingItem) {
      // Update existing item - combine quantities and recipe IDs
      existingItem.quantity += itemData.quantity;
      existingItem.recipeIds = [
        ...new Set([...existingItem.recipeIds, ...itemData.recipeIds])
      ];
      return { ...existingItem };
    } else {
      // Create new item
      const newItem = {
        ...itemData,
        id: Date.now().toString(),
        checked: false,
        category: this.getCategoryByIngredient(itemData.name)
      };
      this.items.push(newItem);
      return { ...newItem };
    }
  }

  async update(id, data) {
    await delay(300);
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Shopping item not found');
    }
    this.items[index] = { ...this.items[index], ...data };
    return { ...this.items[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Shopping item not found');
    }
    this.items.splice(index, 1);
    return true;
  }

  async clearCompleted() {
    await delay(300);
    this.items = this.items.filter(item => !item.checked);
    return true;
  }

  async clearAll() {
    await delay(300);
    this.items = [];
    return true;
  }

  getCategoryByIngredient(ingredientName) {
    const name = ingredientName.toLowerCase();
    
    if (name.includes('chicken') || name.includes('beef') || name.includes('pork') || 
        name.includes('fish') || name.includes('salmon') || name.includes('meat')) {
      return 'Meat';
    }
    
    if (name.includes('milk') || name.includes('cheese') || name.includes('yogurt') || 
        name.includes('butter') || name.includes('cream')) {
      return 'Dairy';
    }
    
    if (name.includes('apple') || name.includes('banana') || name.includes('tomato') || 
        name.includes('onion') || name.includes('garlic') || name.includes('lettuce') ||
        name.includes('spinach') || name.includes('carrot') || name.includes('pepper')) {
      return 'Produce';
    }
    
    if (name.includes('flour') || name.includes('sugar') || name.includes('salt') || 
        name.includes('oil') || name.includes('rice') || name.includes('pasta') ||
        name.includes('bread') || name.includes('cereal')) {
      return 'Pantry';
    }
    
    return 'Other';
  }
}

export const shoppingService = new ShoppingService();