export const candidateMatchesFilters = (candidate = {}, filters = {}) => {
  const normalizedSkill = (filters.skill || '').toString().trim().toLowerCase();
  const normalizedLocation = (filters.location || '').toString().trim().toLowerCase();
  const minExperience = filters.minExperience !== undefined ? Number(filters.minExperience) : null;

  if (normalizedSkill) {
    const skillMatches = (candidate.skills || []).some((skill) => {
      const normalizedCandidateSkill = skill?.toString().trim().toLowerCase();
      return normalizedCandidateSkill.includes(normalizedSkill);
    });

    if (!skillMatches) {
      return false;
    }
  }

  if (minExperience !== null && Number.isFinite(minExperience)) {
    const candidateExperience = Number(candidate.experience_years || 0);
    if (candidateExperience < minExperience) {
      return false;
    }
  }

  if (normalizedLocation) {
    const candidateLocation = (candidate.location || '').toString().trim().toLowerCase();
    if (!candidateLocation.includes(normalizedLocation)) {
      return false;
    }
  }

  return true;
};

export default candidateMatchesFilters;
