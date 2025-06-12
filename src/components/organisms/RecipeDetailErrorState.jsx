import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const RecipeDetailErrorState = ({ message }) => {
  const navigate = useNavigate();
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center py-16">
        <ApperIcon name="AlertTriangle" className="w-16 h-16 text-error mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-secondary mb-2">Recipe not found</h3>
        <p className="text-gray-600 mb-8">{message}</p>
        <Button
          onClick={() => navigate('/')}
          className="bg-primary text-white hover:bg-primary/90"
        >
          Back to Recipes
        </Button>
      </div>
    </div>
  );
};

RecipeDetailErrorState.propTypes = {
  message: PropTypes.string.isRequired,
};

export default RecipeDetailErrorState;