-- Create candidates table
CREATE TABLE IF NOT EXISTS candidates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  linkedin TEXT,
  github TEXT,
  skills TEXT[] NOT NULL DEFAULT '{}',
  experience_years INTEGER NOT NULL DEFAULT 0,
  latest_job_title TEXT,
  location TEXT,
  summary TEXT,
  resume_s3_url TEXT,
  scrubbed_resume_text TEXT,
  score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for search performance
CREATE INDEX IF NOT EXISTS idx_candidates_skills ON candidates USING GIN (skills);
CREATE INDEX IF NOT EXISTS idx_candidates_experience ON candidates (experience_years);
CREATE INDEX IF NOT EXISTS idx_candidates_location ON candidates (location);
CREATE INDEX IF NOT EXISTS idx_candidates_created_at ON candidates (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_candidates_score ON candidates (score DESC);

-- Enable Row Level Security (optional, for production)
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust for production security)
CREATE POLICY "Enable all access for candidates" ON candidates
  FOR ALL
  USING (true)
  WITH CHECK (true);
