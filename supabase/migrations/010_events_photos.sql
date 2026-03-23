-- Migration 010: Add photos array to events
alter table events add column if not exists photos text[] default '{}';
