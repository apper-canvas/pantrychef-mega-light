import PropTypes from 'prop-types';
import Button from '@/components/atoms/Button';
import IngredientCheckItem from '@/components/molecules/IngredientCheckItem';
import ApperIcon from '@/components/ApperIcon';

const RecipeIngredientsList = ({ ingredients, checkedIngredients, onToggleIngredientCheck, onAddMissingToShoppingList }) => {
  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-heading font-semibold text-secondary">
            Ingredients
          </h2>
          <Button
            onClick={onAddMissingToShoppingList}
            className="flex items-center gap-2 px-3 py-2 bg-primary text-white text-sm hover:bg-primary/90"
          >
            <ApperIcon name="ShoppingCart" className="w-4 h-4" />
            Add Missing
          </Button>
        </div>

        <div className="space-y-3">
          {ingredients.map((ingredient, index) => (
            <IngredientCheckItem
              key={ingredient.ingredientId}
              ingredient={ingredient}
              checked={checkedIngredients.has(ingredient.ingredientId)}
              onToggleCheck={onToggleIngredientCheck}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

RecipeIngredientsList.propTypes = {
  ingredients: PropTypes.array.isRequired,
  checkedIngredients: PropTypes.instanceOf(Set).isRequired,
  onToggleIngredientCheck: PropTypes.func.isRequired,
  onAddMissingToShoppingList: PropTypes.func.isRequired,
};

export default RecipeIngredientsList;