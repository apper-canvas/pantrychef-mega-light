import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const ShoppingListSummary = ({ completedCount, totalCount }) => {
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  return (
    <div>
      <h1 className="text-3xl font-heading font-bold text-secondary mb-2">
        Shopping List
      </h1>
      <p className="text-gray-600">
        {completedCount} of {totalCount} items completed
      </p>
      <div className="mb-8 mt-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            className="bg-success h-2 rounded-full transition-all duration-500"
          />
        </div>
      </div>
    </div>
  );
};

ShoppingListSummary.propTypes = {
  completedCount: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
};

export default ShoppingListSummary;