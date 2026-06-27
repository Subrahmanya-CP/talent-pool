import { supabase } from '../config/index.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getAnalytics = asyncHandler(async (req, res) => {
  // Get total candidates
  const { count: totalCandidates } = await supabase
    .from('candidates')
    .select('*', { count: 'exact', head: true });

  // Get candidate data for analytics
  const { data: candidates } = await supabase
    .from('candidates')
    .select('skills, experience_years, location');

  const skillCounts = {};
  candidates?.forEach(candidate => {
    candidate.skills?.forEach(skill => {
      skillCounts[skill] = (skillCounts[skill] || 0) + 1;
    });
  });

  const skillDistribution = Object.entries(skillCounts)
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15); // Top 15 skills

  // Get experience distribution
  const experienceRanges = {
    '0-2 years': 0,
    '2-5 years': 0,
    '5-10 years': 0,
    '10+ years': 0,
  };

  candidates?.forEach(candidate => {
    const exp = candidate.experience_years || 0;
    if (exp < 2) experienceRanges['0-2 years']++;
    else if (exp < 5) experienceRanges['2-5 years']++;
    else if (exp < 10) experienceRanges['5-10 years']++;
    else experienceRanges['10+ years']++;
  });

  const experienceDistribution = Object.entries(experienceRanges).map(([range, count]) => ({
    range,
    count,
  }));

  // Get location distribution
  const locationCounts = {};
  candidates?.forEach(candidate => {
    if (candidate.location) {
      locationCounts[candidate.location] = (locationCounts[candidate.location] || 0) + 1;
    }
  });

  const locationDistribution = Object.entries(locationCounts)
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 locations

  // Get upload trends (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: recentCandidates } = await supabase
    .from('candidates')
    .select('created_at')
    .gte('created_at', thirtyDaysAgo.toISOString())
    .order('created_at', { ascending: true });

  const uploadTrends = {};
  recentCandidates?.forEach(candidate => {
    const date = new Date(candidate.created_at).toLocaleDateString();
    uploadTrends[date] = (uploadTrends[date] || 0) + 1;
  });

  const uploadTrendData = Object.entries(uploadTrends)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  res.json({
    totalCandidates: totalCandidates || 0,
    skillDistribution,
    experienceDistribution,
    locationDistribution,
    uploadTrends: uploadTrendData,
  });
});
