import PropTypes from 'prop-types';
import ApperIcon from '@/components/ApperIcon';

const FilterButton = ({ icon, label, isActive, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors w-full ${
        isActive
          ? 'bg-primary text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } ${className}`}
    >
      <ApperIcon name={icon} className="w-4 h-4" />
      <span className="text-sm">{label}</span>
    </button>
  );
};

FilterButton.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default FilterButton;