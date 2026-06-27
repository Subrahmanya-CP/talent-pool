import api from './api';

export const jobMatchService = {
  matchJob: async (jobDescription) => {
    const response = await api.post('/jobs/match', { jobDescription });
    return response.data;
  },
};

export default jobMatchService;
