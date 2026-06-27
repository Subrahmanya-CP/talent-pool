import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { candidateService } from '../services/candidateService';
import { useToast } from '../hooks/useToast.jsx';
import { useDarkMode } from '../hooks/useDarkMode';
import { ArrowLeft, Mail, Phone, Linkedin, Github, MapPin, Briefcase, Calendar, FileText, Download, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import { CardSkeleton } from '../components/SkeletonLoader';

const CandidateDetails = () => {
  const { id } = useParams();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { showToast, ToastContainer } = useToast();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        setLoading(true);
        const response = await candidateService.getCandidateById(id);
        setCandidate(response.data);
      } catch (err) {
        setError(err.message);
        showToast('Failed to load candidate details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </main>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Candidate Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error || 'The candidate you are looking for does not exist.'}
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Return to Dashboard
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
      <ToastContainer />
      
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
            {candidate.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {candidate.latest_job_title}
          </p>
          {candidate.summary && (
            <p className="mt-4 text-sm text-gray-700 dark:text-gray-300 max-w-3xl">
              {candidate.summary}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Contact Info */}
          <div className="lg:col-span-1 space-y-6 animate-slide-up">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Contact Information</h2>
              <div className="space-y-4">
                {candidate.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <a
                      href={`mailto:${candidate.email}`}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      {candidate.email}
                    </a>
                  </div>
                )}
                {candidate.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <a
                      href={`tel:${candidate.phone}`}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      {candidate.phone}
                    </a>
                  </div>
                )}
                {candidate.linkedin && (
                  <div className="flex items-center gap-3">
                    <Linkedin className="w-5 h-5 text-gray-400" />
                    <a
                      href={`https://${candidate.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      LinkedIn
                    </a>
                  </div>
                )}
                {candidate.github && (
                  <div className="flex items-center gap-3">
                    <Github className="w-5 h-5 text-gray-400" />
                    <a
                      href={`https://${candidate.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      GitHub
                    </a>
                  </div>
                )}
                {candidate.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{candidate.location}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Professional Info</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Latest Job Title</p>
                    <p className="font-medium text-gray-900 dark:text-white">{candidate.latest_job_title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Experience</p>
                    <p className="font-medium text-gray-900 dark:text-white">{candidate.experience_years} years</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">AI Score</p>
                    <p className="font-medium text-gray-900 dark:text-white">{candidate.score || 0}/100</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Added On</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(candidate.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {candidate.resume_s3_url && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Resume</h2>
                <a
                  href={candidate.resume_s3_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                >
                  <Download className="w-5 h-5" />
                  View Resume
                </a>
              </div>
            )}
          </div>

          {/* Right Column - Skills and Details */}
          <div className="lg:col-span-2 space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Resume Text (Scrubbed)</h2>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {candidate.scrubbed_resume_text}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CandidateDetails;
