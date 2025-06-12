import PropTypes from 'prop-types';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const ShoppingListControls = ({ completedCount, onClearCompleted, onClearAll }) => {
  return (
    <div className="flex gap-3">
      {completedCount > 0 && (
        <Button
          onClick={onClearCompleted}
          className="flex items-center gap-2 px-4 py-2 bg-success text-white hover:bg-success/90"
        >
          <ApperIcon name="CheckCheck" className="w-4 h-4" />
          Clear Completed
        </Button>
      )}
      
      <Button
        onClick={onClearAll}
        className="flex items-center gap-2 px-4 py-2 bg-error text-white hover:bg-error/90"
      >
        <ApperIcon name="Trash2" className="w-4 h-4" />
        Clear All
      </Button>
    </div>
  );
};

ShoppingListControls.propTypes = {
  completedCount: PropTypes.number.isRequired,
  onClearCompleted: PropTypes.func.isRequired,
  onClearAll: PropTypes.func.isRequired,
};

export default ShoppingListControls;