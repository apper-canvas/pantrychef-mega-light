import PropTypes from 'prop-types';
import InstructionStep from '@/components/molecules/InstructionStep';

const RecipeInstructionsList = ({ instructions }) => {
  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <h2 className="text-2xl font-heading font-semibold text-secondary mb-8">
          Instructions
        </h2>

        <div className="space-y-6">
          {instructions.map((instruction, index) => (
            <InstructionStep key={index} instruction={instruction} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

RecipeInstructionsList.propTypes = {
  instructions: PropTypes.array.isRequired,
};

export default RecipeInstructionsList;