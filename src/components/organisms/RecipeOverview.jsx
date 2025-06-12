import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import RecipeHeaderInfo from '@/components/molecules/RecipeHeaderInfo';

const RecipeOverview = ({ recipe }) => {
  const navigate = useNavigate();
  return (
    <>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-secondary hover:text-primary mb-6 transition-colors"
      >
        <ApperIcon name="ArrowLeft" className="w-4 h-4" />
        Back to recipes
      </button>
      <RecipeHeaderInfo recipe={recipe} />
    </>
  );
};

RecipeOverview.propTypes = {
  recipe: PropTypes.object.isRequired,
};

export default RecipeOverview;