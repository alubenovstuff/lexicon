-- Replace system question bank
DELETE FROM questions WHERE is_system = true AND class_id IS NULL;

INSERT INTO questions (class_id, is_system, type, allows_text, allows_media, text, order_index) VALUES
  (NULL, true, 'video',       false, true,  'Представи се на останалите',                                                     0),
  (NULL, true, 'class_voice', true,  false, 'Какъв е нашият клас? Опиши го с две или три думи',                               1),
  (NULL, true, 'class_voice', true,  false, 'Кой предмет харесваш най-много:',                                                2),
  (NULL, true, 'class_voice', true,  false, 'А по кой предмет ти е най-трудно?',                                              3),
  (NULL, true, 'personal',    true,  false, 'Ако бях животно, щях да бъда:',                                                  4),
  (NULL, true, 'personal',    true,  false, 'Ако имах вълшебна пръчка, щях да:',                                              5),
  (NULL, true, 'personal',    true,  false, 'Най-хубавото в приятелството е:',                                                6),
  (NULL, true, 'personal',    true,  false, 'Моята тайна суперсила е:',                                                       7),
  (NULL, true, 'personal',    true,  false, 'Мечтая да отида:',                                                               8),
  (NULL, true, 'personal',    true,  false, 'Най-интересният ден тази година беше:',                                          9),
  (NULL, true, 'personal',    true,  false, 'Представи си, че можеш да си учител за един ден. Какво щеше да направиш?',      10),
  (NULL, true, 'class_voice', true,  false, 'Каква е за теб класната/класния? Опиши го с три думи',                          11);
