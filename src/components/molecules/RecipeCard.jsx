import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import ApperIcon from '@/components/ApperIcon';

const RecipeCard = ({ recipe, onClick, onAddToShoppingList, index }) => {
  const { id, image, title, matchPercentage, prepTime, cookTime, servings, tags } = recipe;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={() => onClick(id)}
    >
      <div className="relative h-48">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-primary font-semibold text-sm">
              {matchPercentage}% match
            </span>
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onAddToShoppingList(recipe);
            }}
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
          >
            <ApperIcon name="ShoppingCart" className="w-4 h-4 text-primary" />
          </motion.button>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-heading font-semibold text-secondary mb-2">
          {title}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <ApperIcon name="Clock" className="w-4 h-4" />
            <span>{prepTime + cookTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <ApperIcon name="Users" className="w-4 h-4" />
            <span>{servings} servings</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

RecipeCard.propTypes = {
  recipe: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  onAddToShoppingList: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

export default RecipeCard;