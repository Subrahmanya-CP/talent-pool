/**
 * Export candidates to CSV file
 * @param {Array} candidates - Array of candidate objects
 */
export const exportToCSV = (candidates) => {
  if (!candidates || candidates.length === 0) {
    return;
  }

  // Define CSV headers
  const headers = [
    'Name',
    'Email',
    'Phone',
    'LinkedIn',
    'GitHub',
    'Skills',
    'Experience (Years)',
    'Latest Job Title',
    'Location',
    'Created At',
  ];

  // Convert candidates to CSV rows
  const rows = candidates.map((candidate) => [
    candidate.name || '',
    candidate.email || '',
    candidate.phone || '',
    candidate.linkedin || '',
    candidate.github || '',
    candidate.skills?.join('; ') || '',
    candidate.experience_years || 0,
    candidate.latest_job_title || '',
    candidate.location || '',
    new Date(candidate.created_at).toLocaleDateString(),
  ]);

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map((row) =>
      row
        .map((cell) => {
          // Escape quotes and wrap in quotes if contains comma or quote
          const cellString = String(cell);
          if (cellString.includes(',') || cellString.includes('"') || cellString.includes('\n')) {
            return `"${cellString.replace(/"/g, '""')}"`;
          }
          return cellString;
        })
        .join(',')
    )
    .join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `candidates_export_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default exportToCSV;
