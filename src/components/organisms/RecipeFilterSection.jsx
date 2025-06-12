import PropTypes from 'prop-types';
import FilterButton from '@/components/atoms/FilterButton';

const RecipeFilterSection = ({ filters, onToggleDietaryFilter, onSetCookTimeFilter }) => {
  const dietaryOptions = [
    { id: 'vegetarian', label: 'Vegetarian', icon: 'Leaf' },
    { id: 'vegan', label: 'Vegan', icon: 'Sprout' },
    { id: 'gluten-free', label: 'Gluten-Free', icon: 'WheatOff' },
    { id: 'low-carb', label: 'Low Carb', icon: 'TrendingDown' }
  ];

  const cookTimeOptions = [
    { id: 15, label: '15 min', icon: 'Clock3' },
    { id: 30, label: '30 min', icon: 'Clock6' },
    { id: 60, label: '60+ min', icon: 'Clock12' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-lg font-heading font-semibold text-secondary mb-4">Filters</h3>
      
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Dietary Preferences</h4>
        <div className="space-y-2">
          {dietaryOptions.map((option) => (
            <label key={option.id} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.dietary.includes(option.id)}
                onChange={() => onToggleDietaryFilter(option.id)}
                className="sr-only"
              />
              <FilterButton
                icon={option.icon}
                label={option.label}
                isActive={filters.dietary.includes(option.id)}
                onClick={() => onToggleDietaryFilter(option.id)}
                className={filters.dietary.includes(option.id) ? 'bg-accent text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
              />
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Cook Time</h4>
        <div className="space-y-2">
          {cookTimeOptions.map((option) => (
            <FilterButton
              key={option.id}
              icon={option.icon}
              label={option.label}
              isActive={filters.cookTime === option.id}
              onClick={() => onSetCookTimeFilter(filters.cookTime === option.id ? null : option.id)}
              className={filters.cookTime === option.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

RecipeFilterSection.propTypes = {
  filters: PropTypes.shape({
    dietary: PropTypes.array.isRequired,
    cookTime: PropTypes.number,
  }).isRequired,
  onToggleDietaryFilter: PropTypes.func.isRequired,
  onSetCookTimeFilter: PropTypes.func.isRequired,
};

export default RecipeFilterSection;