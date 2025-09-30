
import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps, stepLabels }) => {
  return (
    <div className="flex justify-center items-center my-8">
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <React.Fragment key={stepNumber}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-colors duration-300 ${
                  isActive ? 'bg-amber-500' : isCompleted ? 'bg-green-500' : 'bg-gray-400'
                }`}
              >
                {isCompleted ? '✓' : stepNumber}
              </div>
              <p className={`mt-2 text-sm text-center ${isActive ? 'text-amber-600 font-bold' : 'text-gray-600'}`}>
                {stepLabels[index]}
              </p>
            </div>
            {stepNumber < totalSteps && <div className="flex-1 h-1 bg-gray-300 mx-4"></div>}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;
