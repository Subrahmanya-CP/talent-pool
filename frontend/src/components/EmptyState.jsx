import { FileText, Users, Search } from 'lucide-react';

const EmptyState = ({ type = 'candidates', action }) => {
  const states = {
    candidates: {
      icon: <Users className="w-16 h-16 text-gray-300" />,
      title: 'No Candidates Yet',
      description: 'Upload resumes to start building your talent pool. Our AI will extract candidate information automatically.',
      actionText: 'Upload Your First Resume',
    },
    search: {
      icon: <Search className="w-16 h-16 text-gray-300" />,
      title: 'No Results Found',
      description: 'Try adjusting your search filters or upload more resumes to expand your talent pool.',
      actionText: 'Clear Filters',
    },
    upload: {
      icon: <FileText className="w-16 h-16 text-gray-300" />,
      title: 'Ready to Upload',
      description: 'Select PDF or DOCX files to begin. We support up to 10 files at once, with a maximum size of 10MB each.',
      actionText: 'Select Files',
    },
  };

  const state = states[type] || states.candidates;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="mb-4">{state.icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {state.title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
        {state.description}
      </p>
      {action && (
        <button
          onClick={action}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {state.actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
