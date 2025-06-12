import PropTypes from 'prop-types';

const Input = ({ type = 'text', value, onChange, placeholder, className = '', icon: Icon, ...props }) => {
  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
        {...props}
      />
      {Icon && (
        <Icon className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
      )}
    </div>
  );
};

Input.propTypes = {
  type: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  icon: PropTypes.elementType, // For ApperIcon or other icon components
};

export default Input;