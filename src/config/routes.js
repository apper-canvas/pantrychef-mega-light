import HomePage from '@/components/pages/HomePage';
import RecipeDetailPage from '@/components/pages/RecipeDetailPage';
import ShoppingListPage from '@/components/pages/ShoppingListPage';
import NotFoundPage from '@/components/pages/NotFoundPage';

export const routes = {
  home: {
    id: 'home',
    label: 'Find Recipes',
    path: '/',
    icon: 'ChefHat',
component: HomePage
  },
  shoppingList: {
    id: 'shoppingList',
    label: 'Shopping List',
    path: '/shopping',
    icon: 'ShoppingCart',
component: ShoppingListPage
  },
  recipeDetail: {
    id: 'recipeDetail',
    label: 'Recipe',
    path: '/recipe/:id',
    icon: 'Book',
component: RecipeDetailPage,
    hideFromNav: true
  },
  notFound: {
    id: 'notFound',
    label: 'Not Found',
    path: '*',
component: NotFoundPage,
    hideFromNav: true
  }
};

export const routeArray = Object.values(routes);