-- Add preset column to questions
-- preset = null  → system archive question (existing behaviour)
-- preset = 'primary' → default questionnaire for 1–4 grade

ALTER TABLE questions ADD COLUMN IF NOT EXISTS preset TEXT;

-- Seed the primary (1–4 клас) preset questions
INSERT INTO questions (text, type, allows_text, allows_media, order_index, is_system, preset, voice_display, description, is_featured)
VALUES
  ('Най-любимият ми предмет в училище е',        'class_voice', true,  false, 0,  true, 'primary', 'barchart',  null,                                          false),
  ('А най-трудният е',                            'class_voice', true,  false, 1,  true, 'primary', 'barchart',  null,                                          false),
  ('Какъв е нашият клас? Опиши го с две или три думи', 'class_voice', true, false, 2, true, 'primary', 'wordcloud', null,                                       false),
  ('В междучасията най-често:',                   'class_voice', true,  false, 3,  true, 'primary', 'wordcloud', null,                                          false),
  ('Каква суперсила има класният/класната?',      'class_voice', true,  false, 4,  true, 'primary', 'wordcloud', null,                                          false),
  ('Представи се на останалите',                  'video',       false, true,  5,  true, 'primary', null,        null,                                          false),
  ('Ако имах вълшебна пръчка, щях да',            'personal',    true,  false, 6,  true, 'primary', null,        null,                                          true),
  ('Моята тайна суперсила е',                     'personal',    true,  false, 7,  true, 'primary', null,        'Какво мислиш, че правиш по специален начин?', true),
  ('Като порасна искам да стана',                 'personal',    true,  false, 8,  true, 'primary', null,        null,                                          true),
  ('Най-интересният ден тази година беше:',       'personal',    true,  false, 9,  true, 'primary', null,        null,                                          false),
  ('Ако бях животно, щях да съм:',               'personal',    true,  false, 10, true, 'primary', null,        null,                                          false),
  ('Ако бях супергерой, щях да:',                'personal',    true,  false, 11, true, 'primary', null,        null,                                          false),
  ('Мечтая да отида в:',                         'personal',    true,  false, 12, true, 'primary', null,        null,                                          false),
  ('Ако бях учител за един ден, щях да:',        'personal',    true,  false, 13, true, 'primary', null,        null,                                          false);
Да направим уизард за модеартори, който да излиза най-горе в админ панела и да отключва действия стъпка по стъпка: 1. Създай клас  2. Създай събития 
3. Избери шаблон на лексикон 4. Финализирай въпросник 5. Изпрати покани за попълване (лексиконът се заключва и не можеш да редактираш) 6. Финализирай лексикона 7. Плащане и разпращане на лексикона

Този уизард се вижда вътре в модераторския панел, най-горе, с големи и ясни стъпки кое след кое следва