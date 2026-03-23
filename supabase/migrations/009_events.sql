-- Migration 009: Events
create table events (
  id          uuid primary key default gen_random_uuid(),
  class_id    uuid not null references classes(id) on delete cascade,
  title       text not null,
  event_date  date,
  note        text,
  order_index integer not null default 0,
  created_at  timestamptz default now()
);

-- Moderator can manage events for their class
create policy "Moderator can manage events"
  on events for all
  using (
    exists (
      select 1 from classes
      where classes.id = events.class_id
        and classes.moderator_id = auth.uid()
    )
  );

alter table events enable row level security;
