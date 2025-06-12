import PropTypes from 'prop-types';
import IngredientSearchInput from '@/components/molecules/IngredientSearchInput';
import SelectedIngredientsList from '@/components/molecules/SelectedIngredientsList';

const PantrySection = ({
  searchTerm,
  onSearchChange,
  suggestions,
  pantryIngredients,
  onAddIngredient,
  onRemoveIngredient,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-lg font-heading font-semibold text-secondary mb-4">
        What's in your pantry?
      </h2>
      
      <IngredientSearchInput
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        suggestions={suggestions}
        onAddIngredient={onAddIngredient}
      />

      <SelectedIngredientsList
        ingredients={pantryIngredients}
        onRemoveIngredient={onRemoveIngredient}
      />
    </div>
  );
};

PantrySection.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  suggestions: PropTypes.array.isRequired,
  pantryIngredients: PropTypes.array.isRequired,
  onAddIngredient: PropTypes.func.isRequired,
  onRemoveIngredient: PropTypes.func.isRequired,
};

export default PantrySection;