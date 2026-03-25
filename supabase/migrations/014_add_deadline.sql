-- Add deadline column to classes
alter table classes add column if not exists deadline timestamptz;
