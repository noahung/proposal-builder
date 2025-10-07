import React from 'react';
import { NeumorphCard } from '../ui/neumorph-card';

export const SetupErrorScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <NeumorphCard className="max-w-2xl p-8 space-y-6">
        <div className="text-center space-y-4">
          {/* Icon */}
          <div className="text-6xl">⚙️</div>
          
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800">
            Setup Required
          </h1>
          
          {/* Message */}
          <p className="text-gray-600 text-lg">
            Supabase environment variables are missing.
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <h2 className="font-semibold text-gray-800 text-lg">
            How to fix:
          </h2>
          
          <ol className="space-y-3 text-gray-700">
            <li className="flex gap-3">
              <span className="font-bold text-blue-600">1.</span>
              <div>
                <p className="font-medium">Create a <code className="bg-gray-200 px-2 py-1 rounded">.env.local</code> file in the project root</p>
              </div>
            </li>
            
            <li className="flex gap-3">
              <span className="font-bold text-blue-600">2.</span>
              <div>
                <p className="font-medium">Copy the template from <code className="bg-gray-200 px-2 py-1 rounded">.env.local.example</code></p>
              </div>
            </li>
            
            <li className="flex gap-3">
              <span className="font-bold text-blue-600">3.</span>
              <div>
                <p className="font-medium">Add your Supabase credentials:</p>
                <pre className="bg-gray-800 text-gray-100 p-3 rounded mt-2 text-sm overflow-x-auto">
{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here`}
                </pre>
              </div>
            </li>
            
            <li className="flex gap-3">
              <span className="font-bold text-blue-600">4.</span>
              <div>
                <p className="font-medium">Restart the development server</p>
                <pre className="bg-gray-800 text-gray-100 p-3 rounded mt-2 text-sm">
npm run dev
                </pre>
              </div>
            </li>
          </ol>
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>💡 Tip:</strong> You can find your Supabase credentials in your{' '}
            <a
              href="https://app.supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-600"
            >
              Supabase Dashboard
            </a>{' '}
            under <strong>Settings → API</strong>
          </p>
        </div>

        {/* Technical Details */}
        <details className="text-sm">
          <summary className="cursor-pointer text-gray-600 hover:text-gray-800 font-medium">
            Technical Details
          </summary>
          <div className="mt-3 bg-gray-50 p-4 rounded space-y-2 text-gray-700">
            <p>
              <strong>Error:</strong> Missing environment variables
            </p>
            <p>
              <strong>Required:</strong>
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><code>VITE_SUPABASE_URL</code></li>
              <li><code>VITE_SUPABASE_ANON_KEY</code></li>
            </ul>
            <p className="mt-3">
              <strong>Note:</strong> The application cannot function without a valid Supabase connection.
              All authentication and data storage depends on Supabase.
            </p>
          </div>
        </details>
      </NeumorphCard>
    </div>
  );
};
