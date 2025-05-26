import React from 'react';

const ApiKeyWarning: React.FC = () => {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-4 sm:mx-6 lg:mx-8 mt-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            OpenAI API Key Required
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              To use audio transcription and note enhancement features, you need to configure your OpenAI API key.
            </p>
            <div className="mt-3">
              <div className="text-sm">
                <strong>Steps to configure:</strong>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">OpenAI Platform</a></li>
                  <li>Create a <code className="bg-yellow-100 px-1 rounded">.env.local</code> file in the project root</li>
                  <li>Add: <code className="bg-yellow-100 px-1 rounded">VITE_OPENAI_API_KEY=your_api_key_here</code></li>
                  <li>Restart the development server</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyWarning; 