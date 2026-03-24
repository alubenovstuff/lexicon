-- Add new columns for class metadata and layout system
-- Run this in Supabase SQL Editor

ALTER TABLE classes
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS teacher_name TEXT,
  ADD COLUMN IF NOT EXISTS cover_image_url TEXT,
  ADD COLUMN IF NOT EXISTS template_id TEXT DEFAULT 'classic',
  ADD COLUMN IF NOT EXISTS layout JSONB;
