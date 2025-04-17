import React from 'react';

interface FeatureToggleProps {
  label: string;
  isEnabled: boolean;
  onChange: () => void;
}

export const FeatureToggle: React.FC<FeatureToggleProps> = ({ label, isEnabled, onChange }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-300">{label}</span>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
          isEnabled ? 'bg-blue-500' : 'bg-gray-700'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
            isEnabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}; 