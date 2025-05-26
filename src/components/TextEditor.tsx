import React from 'react';

interface TextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const TextEditor: React.FC<TextEditorProps> = ({ 
  content, 
  onChange, 
  placeholder = "Enter your notes here..." 
}) => {
  return (
    <div className="space-y-2">
      <label htmlFor="raw-notes" className="block text-sm font-medium text-gray-700">
        Raw Notes
      </label>
      <textarea
        id="raw-notes"
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={12}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-none"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>{content.length} characters</span>
        <span>{content.split(/\s+/).filter(word => word.length > 0).length} words</span>
      </div>
    </div>
  );
};

export default TextEditor; 