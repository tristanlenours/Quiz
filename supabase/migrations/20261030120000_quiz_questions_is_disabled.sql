-- D38 : une question désactivée reste en base (identifiants et historique conservés)
-- mais n'est plus jouée.
alter table public.quiz_questions
  add column if not exists is_disabled boolean not null default false;
