import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const Button = ({ children, onClick, className = '', whileHover = { scale: 1.05 }, whileTap = { scale: 0.95 }, ...props }) => {
  return (
    <motion.button
      whileHover={whileHover}
      whileTap={whileTap}
      onClick={onClick}
      className={`px-6 py-3 rounded-lg font-medium transition-colors ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  whileHover: PropTypes.object,
  whileTap: PropTypes.object,
};

export default Button;