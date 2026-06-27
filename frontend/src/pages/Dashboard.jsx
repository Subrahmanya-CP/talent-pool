import { useState } from 'react';
import { useCandidates } from '../hooks/useCandidates';
import { useFileUpload } from '../hooks/useFileUpload';
import { useToast } from '../hooks/useToast.jsx';
import { useDarkMode } from '../hooks/useDarkMode';
import { candidateService } from '../services/candidateService';
import { exportToCSV } from '../utils/csvExport';
import UploadCard from '../components/UploadCard';
import FilterBar from '../components/FilterBar';
import CandidateTable from '../components/CandidateTable';
import EmptyState from '../components/EmptyState';
import Navbar from '../components/Navbar';
import { TableSkeleton } from '../components/SkeletonLoader';
import { Download, ArrowUpDown } from 'lucide-react';

const Dashboard = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filters, setFilters] = useState({});
  const [sortByScore, setSortByScore] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { showToast, ToastContainer } = useToast();

  const { candidates, loading, error, refetch } = useCandidates(filters);
  const { uploadFiles, uploading, uploadProgress, uploadedCandidates, reset } = useFileUpload();

  const handleFileSelect = (files) => {
    setSelectedFiles((prev) => [...prev, ...files]);
    showToast(`${files.length} file${files.length > 1 ? 's' : ''} selected`, 'success');
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    try {
      await uploadFiles(selectedFiles);
      setSelectedFiles([]);
      showToast(`Successfully processed ${uploadedCandidates.length} candidate${uploadedCandidates.length > 1 ? 's' : ''}`, 'success');
      setTimeout(() => {
        reset();
        refetch();
      }, 1000);
    } catch (err) {
      showToast('Upload failed. Please try again.', 'error');
      console.error('Upload failed:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        await candidateService.deleteCandidate(id);
        refetch();
        showToast('Candidate deleted successfully', 'success');
      } catch (err) {
        showToast('Failed to delete candidate', 'error');
        console.error('Delete failed:', err);
      }
    }
  };

  const handleExportCSV = () => {
    if (candidates.length === 0) {
      showToast('No candidates to export', 'warning');
      return;
    }
    exportToCSV(candidates);
    showToast('CSV exported successfully', 'success');
  };

  const handleClearFilters = () => {
    setFilters({});
    showToast('Filters cleared', 'success');
  };

  const handleSortByScore = () => {
    setSortByScore(!sortByScore);
    showToast(sortByScore ? 'Score sorting disabled' : 'Sorting by score', 'success');
  };

  // Sort candidates by score if enabled
  const sortedCandidates = sortByScore
    ? [...candidates].sort((a, b) => (b.score || 0) - (a.score || 0))
    : candidates;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
      <ToastContainer />
      
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Talent Pool Search Platform
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload resumes and search candidates with AI-powered extraction
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-1 animate-slide-up">
            <UploadCard
              files={selectedFiles}
              onRemove={handleRemoveFile}
              onUpload={handleFileSelect}
              uploading={uploading}
              uploadProgress={uploadProgress}
            />
            {selectedFiles.length > 0 && !uploading && (
              <button
                onClick={handleUpload}
                className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium animate-scale-in"
              >
                Upload {selectedFiles.length} File{selectedFiles.length > 1 ? 's' : ''}
              </button>
            )}
          </div>
          <div className="lg:col-span-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <FilterBar filters={filters} onFilterChange={setFilters} />
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Candidates ({candidates.length})
          </h2>
          <div className="flex items-center gap-2">
            {candidates.length > 0 && (
              <button
                onClick={handleSortByScore}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium ${
                  sortByScore
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <ArrowUpDown className="w-4 h-4" />
                Sort by Score
              </button>
            )}
            {candidates.length > 0 && (
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <TableSkeleton />
        ) : candidates.length === 0 ? (
          <EmptyState
            type={Object.keys(filters).some(key => filters[key]) ? 'search' : 'candidates'}
            action={Object.keys(filters).some(key => filters[key]) ? handleClearFilters : null}
          />
        ) : (
          <CandidateTable
            candidates={sortedCandidates}
            loading={loading}
            onDelete={handleDelete}
          />
        )}

        {error && (
          <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 animate-scale-in">
            <p className="text-red-800 dark:text-red-400">{error}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
