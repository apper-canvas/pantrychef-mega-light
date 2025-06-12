import PropTypes from 'prop-types';
import ApperIcon from '@/components/ApperIcon';

const RecipeHeaderInfo = ({ recipe }) => {
  const { image, title, matchPercentage, tags, prepTime, cookTime, servings } = recipe;

  return (
    <div className="relative h-80 rounded-2xl overflow-hidden mb-8">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-8 left-8 right-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-primary font-semibold">
              {matchPercentage}% match
            </span>
          </div>
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
        <h1 className="text-4xl font-heading font-bold text-white mb-4">
          {title}
        </h1>
        <div className="flex items-center gap-6 text-white/90">
          <div className="flex items-center gap-2">
            <ApperIcon name="Clock" className="w-5 h-5" />
            <span>Prep: {prepTime} min</span>
          </div>
          <div className="flex items-center gap-2">
            <ApperIcon name="ChefHat" className="w-5 h-5" />
            <span>Cook: {cookTime} min</span>
          </div>
          <div className="flex items-center gap-2">
            <ApperIcon name="Users" className="w-5 h-5" />
            <span>{servings} servings</span>
          </div>
        </div>
      </div>
    </div>
  );
};

RecipeHeaderInfo.propTypes = {
  recipe: PropTypes.object.isRequired,
};

export default RecipeHeaderInfo;