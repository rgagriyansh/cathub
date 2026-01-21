-- CatHub Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table to store MBA applicant data
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  
  -- Personal Information
  personal_info JSONB DEFAULT '{}'::jsonb,
  
  -- Academic Records (array of academic entries)
  academics JSONB DEFAULT '[]'::jsonb,
  
  -- Entrance Scores (CAT, XAT, GMAT, etc.)
  entrance_scores JSONB DEFAULT '[]'::jsonb,
  
  -- Work Experience (array of work entries)
  work_experience JSONB DEFAULT '[]'::jsonb,
  
  -- Extra & Co-curricular Activities
  activities JSONB DEFAULT '[]'::jsonb,
  
  -- Achievements and Awards
  achievements JSONB DEFAULT '[]'::jsonb,
  
  -- Certifications
  certifications JSONB DEFAULT '[]'::jsonb,
  
  -- Career Goals
  career_goals JSONB DEFAULT '{}'::jsonb,
  
  -- Additional Information
  additional_info JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated SOPs table
CREATE TABLE IF NOT EXISTS generated_sops (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- SOP Details
  title VARCHAR(255) NOT NULL,
  school_name VARCHAR(255),
  sop_type VARCHAR(50) DEFAULT 'sop', -- 'sop', 'essay', 'short_answer'
  prompt_used TEXT,
  
  -- Generated Content
  content TEXT NOT NULL,
  word_count INTEGER,
  
  -- Metadata
  is_favorite BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_sops_user_id ON generated_sops(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_sops_profile_id ON generated_sops(profile_id);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_sops ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile" 
  ON profiles FOR DELETE 
  USING (auth.uid() = user_id);

-- Generated SOPs policies
CREATE POLICY "Users can view their own SOPs" 
  ON generated_sops FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own SOPs" 
  ON generated_sops FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own SOPs" 
  ON generated_sops FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own SOPs" 
  ON generated_sops FOR DELETE 
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_generated_sops_updated_at
  BEFORE UPDATE ON generated_sops
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Profile Shares table for public profile sharing
CREATE TABLE IF NOT EXISTS profile_shares (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Unique share token for public URL
  share_token VARCHAR(12) UNIQUE NOT NULL,
  
  -- What sections to show (array of section names)
  visible_sections JSONB DEFAULT '["personalInfo", "academics", "workExperience", "achievements", "activities"]'::jsonb,
  
  -- Share settings
  is_active BOOLEAN DEFAULT TRUE,
  show_contact_info BOOLEAN DEFAULT TRUE,
  custom_headline TEXT,
  
  -- Analytics
  view_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for quick token lookups
CREATE INDEX IF NOT EXISTS idx_profile_shares_token ON profile_shares(share_token);
CREATE INDEX IF NOT EXISTS idx_profile_shares_user_id ON profile_shares(user_id);

-- Enable RLS for profile_shares
ALTER TABLE profile_shares ENABLE ROW LEVEL SECURITY;

-- Users can manage their own share settings
CREATE POLICY "Users can view their own share settings" 
  ON profile_shares FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own share settings" 
  ON profile_shares FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own share settings" 
  ON profile_shares FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own share settings" 
  ON profile_shares FOR DELETE 
  USING (auth.uid() = user_id);

-- Public can view active shares (for public profile page)
CREATE POLICY "Anyone can view active public profiles" 
  ON profile_shares FOR SELECT 
  USING (is_active = TRUE);

-- Trigger for updated_at
CREATE TRIGGER update_profile_shares_updated_at
  BEFORE UPDATE ON profile_shares
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
