import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const InstructionStep = ({ instruction, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex gap-4"
    >
      <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-sm">
        {index + 1}
      </div>
      <div className="flex-1">
        <p className="text-gray-700 leading-relaxed">{instruction}</p>
      </div>
    </motion.div>
  );
};

InstructionStep.propTypes = {
  instruction: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

export default InstructionStep;