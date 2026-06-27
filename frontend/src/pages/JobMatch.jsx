import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../hooks/useDarkMode';
import { useToast } from '../hooks/useToast';
import { jobMatchService } from '../services/jobMatchService';
import Navbar from '../components/Navbar';
import { Briefcase, Search, ArrowRight, Star, TrendingUp } from 'lucide-react';

const JobMatch = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { showToast, ToastContainer } = useToast();
  const navigate = useNavigate();
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleMatch = async () => {
    if (!jobDescription.trim()) {
      showToast('Please enter a job description', 'warning');
      return;
    }

    try {
      setLoading(true);
      const response = await jobMatchService.matchJob(jobDescription);
      setResults(response);
      showToast(`Found ${response.matches.length} matching candidates`, 'success');
    } catch (err) {
      showToast('Failed to match candidates. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900';
    return 'bg-red-100 dark:bg-red-900';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
      <ToastContainer />
      
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            AI Job Matching
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Paste a job description to find the best matching candidates
          </p>
        </div>

        {/* Job Description Input */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 animate-slide-up">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Job Description</h2>
          </div>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here. Include required skills, experience level, and any specific requirements..."
            className="w-full h-48 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none"
          />
          <button
            onClick={handleMatch}
            disabled={loading}
            className="mt-4 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Find Matches
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {results && (
          <div className="animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Matching Candidates ({results.matches.length})
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <TrendingUp className="w-4 h-4" />
                Sorted by match score
              </div>
            </div>

            <div className="space-y-4">
              {results.matches.map((candidate, index) => (
                <div
                  key={candidate.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {candidate.name}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBg(
                            candidate.matchScore
                          )} ${getScoreColor(candidate.matchScore)}`}
                        >
                          {candidate.matchScore}% Match
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {candidate.latest_job_title} • {candidate.experience_years} years experience • {candidate.location}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {candidate.skills.slice(0, 5).map((skill, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                        {candidate.skills.length > 5 && (
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                            +{candidate.skills.length - 5} more
                          </span>
                        )}
                      </div>
                      {candidate.matchReasoning && (
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <strong className="text-gray-900 dark:text-white">Why this candidate:</strong> {candidate.matchReasoning}
                          </p>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => navigate(`/candidate/${candidate.id}`)}
                      className="ml-4 flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {results.matches.length === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">No matching candidates found</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default JobMatch;
