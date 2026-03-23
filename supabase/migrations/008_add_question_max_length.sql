-- Migration 008: Add max_length to questions
alter table questions add column if not exists max_length integer;
