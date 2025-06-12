import { AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import Pill from '@/components/atoms/Pill';

const SelectedIngredientsList = ({ ingredients, onRemoveIngredient }) => {
  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {ingredients.map((ingredient) => (
            <Pill key={ingredient.id} onRemove={() => onRemoveIngredient(ingredient.id)}>
              {ingredient.name}
            </Pill>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

SelectedIngredientsList.propTypes = {
  ingredients: PropTypes.array.isRequired,
  onRemoveIngredient: PropTypes.func.isRequired,
};

export default SelectedIngredientsList;