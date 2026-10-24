-- Durée par défaut des questions (temps de réponse / extrait) passée de 20 s à 30 s (Décision D20).
alter table public.quiz_questions alter column audio_duration_sec set default 30;
