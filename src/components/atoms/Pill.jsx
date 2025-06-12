import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import ApperIcon from '@/components/ApperIcon';

const Pill = ({ children, onRemove, className = '', whileHover = { scale: 1.05 }, whileTap = { scale: 0.95 }, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2 ${className}`}
      {...props}
    >
      <span>{children}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="hover:bg-primary hover:text-white rounded-full p-0.5 transition-colors"
        >
          <ApperIcon name="X" className="w-3 h-3" />
        </button>
      )}
    </motion.div>
  );
};

Pill.propTypes = {
  children: PropTypes.node.isRequired,
  onRemove: PropTypes.func,
  className: PropTypes.string,
  whileHover: PropTypes.object,
  whileTap: PropTypes.object,
};

export default Pill;