import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import ApperIcon from '@/components/ApperIcon';

const Checkbox = ({ checked, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
        checked
          ? 'bg-success border-success text-white'
          : 'border-gray-300 hover:border-primary'
      } ${className}`}
    >
      {checked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.3 }}
        >
          <ApperIcon name="Check" className="w-3 h-3" />
        </motion.div>
      )}
    </button>
  );
};

Checkbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default Checkbox;