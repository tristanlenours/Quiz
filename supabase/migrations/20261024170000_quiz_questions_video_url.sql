-- Extrait vidéo (lien YouTube) joué sur l'Écran Hôte (Décision D19).
-- Réutilise audio_start_sec (début) et audio_duration_sec (durée de l'extrait).
alter table public.quiz_questions add column if not exists video_url text;
