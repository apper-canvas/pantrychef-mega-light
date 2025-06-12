import Home from '../pages/Home';
import RecipeDetail from '../pages/RecipeDetail';
import ShoppingList from '../pages/ShoppingList';
import NotFound from '../pages/NotFound';

export const routes = {
  home: {
    id: 'home',
    label: 'Find Recipes',
    path: '/',
    icon: 'ChefHat',
    component: Home
  },
  shoppingList: {
    id: 'shoppingList',
    label: 'Shopping List',
    path: '/shopping',
    icon: 'ShoppingCart',
    component: ShoppingList
  },
  recipeDetail: {
    id: 'recipeDetail',
    label: 'Recipe',
    path: '/recipe/:id',
    icon: 'Book',
    component: RecipeDetail,
    hideFromNav: true
  },
  notFound: {
    id: 'notFound',
    label: 'Not Found',
    path: '*',
    component: NotFound,
    hideFromNav: true
  }
};

export const routeArray = Object.values(routes);