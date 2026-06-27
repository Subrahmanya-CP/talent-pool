import { useState, useEffect } from 'react';
import { candidateService } from '../services/candidateService';

export const useCandidates = (filters = {}) => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await candidateService.getCandidates(filters);
      setCandidates(response.data.candidates);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [JSON.stringify(filters)]);

  return { candidates, loading, error, refetch: fetchCandidates };
};

export default useCandidates;
