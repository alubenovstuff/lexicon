-- Event comments: students/parents can leave a short comment on each event photo
CREATE TABLE IF NOT EXISTS event_comments (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    UUID        NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  student_id  UUID        NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  comment_text TEXT       NOT NULL CHECK (char_length(comment_text) <= 300),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_comments_event_id    ON event_comments(event_id);
CREATE INDEX IF NOT EXISTS idx_event_comments_student_id  ON event_comments(student_id);
