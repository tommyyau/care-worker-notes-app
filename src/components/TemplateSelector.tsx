import React from 'react';
import type { VisitType } from '../types';

interface TemplateSelectorProps {
  visitType: VisitType;
  onVisitTypeChange: (visitType: VisitType) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ 
  visitType, 
  onVisitTypeChange 
}) => {
  const visitTypes: { value: VisitType; label: string; description: string }[] = [
    {
      value: 'standard',
      label: 'Standard Care',
      description: 'General care visits and routine check-ups'
    },
    {
      value: 'medication',
      label: 'Medication',
      description: 'Medication administration and monitoring'
    },
    {
      value: 'therapy',
      label: 'Therapy',
      description: 'Therapeutic care sessions and rehabilitation'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Visit Type</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {visitTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => onVisitTypeChange(type.value)}
            className={`p-4 text-left border-2 rounded-xl transition-all ${
              visitType === type.value
                ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-md'
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 text-gray-700'
            }`}
          >
            <div className="font-semibold text-base mb-1">{type.label}</div>
            <div className="text-sm text-gray-600">{type.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector; 