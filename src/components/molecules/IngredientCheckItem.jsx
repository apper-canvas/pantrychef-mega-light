import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import Checkbox from '@/components/atoms/Checkbox';

const IngredientCheckItem = ({ ingredient, checked, onToggleCheck, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-3"
    >
      <Checkbox checked={checked} onClick={() => onToggleCheck(ingredient.ingredientId)} />
      <div className={`flex-1 ${checked ? 'line-through text-gray-500' : ''}`}>
        <span className="font-medium">
          {ingredient.quantity} {ingredient.unit}
        </span>
        <span className="ml-2">{ingredient.name}</span>
      </div>
    </motion.div>
  );
};

IngredientCheckItem.propTypes = {
  ingredient: PropTypes.object.isRequired,
  checked: PropTypes.bool.isRequired,
  onToggleCheck: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

export default IngredientCheckItem;