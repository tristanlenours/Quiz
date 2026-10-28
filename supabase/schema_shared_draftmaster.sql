-- ==============================================================================
-- QUIZ & BLIND TEST PERSO — Schéma PostgreSQL Supabase (Cohabitation DraftMaster)
-- ==============================================================================
-- Toutes les tables et vues sont préfixées par `quiz_` (Décision D02) afin de
-- cohabiter sans aucune collision avec les tables de DraftMaster.
-- ==============================================================================

-- 1. Table des Packs de Jeu (Quiz & Blind Test)
create table if not exists public.quiz_sets (
    id uuid default gen_random_uuid() not null primary key,
    created_at timestamp with time zone default now() not null,
    name text not null,
    description text,
    mode text default 'mixed' not null check (mode in ('quiz', 'blind_test', 'mixed')),
    avatar_theme text default 'love_actually' not null
);

alter table public.quiz_sets add column if not exists avatar_theme text default 'love_actually' not null;

-- 2. Table des Questions / Manches (Quiz classique + Blind Test musical — Décision D04)
create table if not exists public.quiz_questions (
    id uuid default gen_random_uuid() not null primary key,
    created_at timestamp with time zone default now() not null,
    quiz_set_id uuid not null references public.quiz_sets(id) on delete cascade on update cascade,
    "order" smallint not null,
    question_type text default 'quiz' not null check (question_type in ('quiz', 'blind_test')),
    body text not null,
    image_url text,
    -- Champs spécifiques Blind Test & Audio
    audio_url text,
    audio_start_sec integer default 0 not null,
    audio_duration_sec integer default 30 not null,
    -- Métadonnées dévoilées uniquement à la révélation (is_answer_revealed = true)
    reveal_title text,
    reveal_artist text,
    reveal_cover_url text,
    -- Extrait vidéo YouTube joué sur l'Écran Hôte (Décision D19)
    video_url text
);

-- Migration idempotente pour les bases existantes (Décision D19)
alter table public.quiz_questions add column if not exists video_url text;
-- Durée par défaut des questions passée à 30 s (Décision D20)
alter table public.quiz_questions alter column audio_duration_sec set default 30;

-- 3. Table des Choix de Réponse (QCM)
create table if not exists public.quiz_choices (
    id uuid default gen_random_uuid() not null primary key,
    created_at timestamp with time zone default now() not null,
    question_id uuid not null references public.quiz_questions(id) on delete cascade on update cascade,
    body text not null,
    is_correct boolean default false not null
);

-- 4. Table des Sessions de Jeu Live
create table if not exists public.quiz_games (
    id uuid default gen_random_uuid() not null primary key,
    created_at timestamp with time zone default now() not null,
    quiz_set_id uuid not null references public.quiz_sets(id) on delete cascade on update cascade,
    pin_code text not null default lpad((floor(random() * 900000) + 100000)::text, 6, '0'),
    current_question_sequence smallint default 0 not null,
    is_answer_revealed boolean default false not null,
    phase text default 'lobby' not null check (phase in ('lobby', 'quiz', 'result'))
);

create index if not exists idx_quiz_games_pin_code on public.quiz_games(pin_code);

-- 5. Table des Participants (Sans friction Auth obligatoire — Décision D05 + Avatars D21)
create table if not exists public.quiz_participants (
    id uuid default gen_random_uuid() not null primary key,
    created_at timestamp with time zone default now() not null,
    nickname text not null,
    avatar_id text,
    game_id uuid not null references public.quiz_games(id) on delete cascade on update cascade,
    client_session_id text not null,
    unique (game_id, client_session_id)
);

alter table public.quiz_participants add column if not exists avatar_id text;
create unique index if not exists idx_quiz_participants_unique_avatar
    on public.quiz_participants (game_id, avatar_id)
    where avatar_id is not null;

-- 6. Table des Réponses Joueurs
create table if not exists public.quiz_answers (
    id uuid default gen_random_uuid() not null primary key,
    created_at timestamp with time zone default now() not null,
    participant_id uuid not null references public.quiz_participants(id) on delete cascade on update cascade,
    question_id uuid not null references public.quiz_questions(id) on delete cascade on update cascade,
    choice_id uuid references public.quiz_choices(id) on delete set null on update cascade,
    text_answer text,
    score smallint not null default 0,
    unique (participant_id, question_id)
);

-- 7. Vue des Résultats & Classement
create or replace view public.quiz_game_results as
    select
        p.id as participant_id,
        p.nickname,
        coalesce(sum(a.score), 0)::integer as total_score,
        g.id as game_id,
        p.avatar_id
    from public.quiz_games g
    inner join public.quiz_participants p on g.id = p.game_id
    left join public.quiz_answers a on p.id = a.participant_id
    group by g.id, p.id, p.nickname, p.avatar_id;

-- 8. Activer Supabase Realtime de manière idempotente
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'quiz_games'
  ) then
    alter publication supabase_realtime add table public.quiz_games;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'quiz_participants'
  ) then
    alter publication supabase_realtime add table public.quiz_participants;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'quiz_answers'
  ) then
    alter publication supabase_realtime add table public.quiz_answers;
  end if;
end $$;

-- 9. Politiques RLS (Row Level Security)
alter table public.quiz_sets enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_choices enable row level security;
alter table public.quiz_games enable row level security;
alter table public.quiz_participants enable row level security;
alter table public.quiz_answers enable row level security;

drop policy if exists "Lecture publique quiz_sets" on public.quiz_sets;
create policy "Lecture publique quiz_sets" on public.quiz_sets for select using (true);
drop policy if exists "Ecriture quiz_sets" on public.quiz_sets;
create policy "Ecriture quiz_sets" on public.quiz_sets for all using (true) with check (true);

drop policy if exists "Lecture publique quiz_questions" on public.quiz_questions;
create policy "Lecture publique quiz_questions" on public.quiz_questions for select using (true);
drop policy if exists "Ecriture quiz_questions" on public.quiz_questions;
create policy "Ecriture quiz_questions" on public.quiz_questions for all using (true) with check (true);

drop policy if exists "Lecture publique quiz_choices" on public.quiz_choices;
create policy "Lecture publique quiz_choices" on public.quiz_choices for select using (true);
drop policy if exists "Ecriture quiz_choices" on public.quiz_choices;
create policy "Ecriture quiz_choices" on public.quiz_choices for all using (true) with check (true);

drop policy if exists "Lecture publique quiz_games" on public.quiz_games;
create policy "Lecture publique quiz_games" on public.quiz_games for select using (true);
drop policy if exists "Ecriture quiz_games" on public.quiz_games;
create policy "Ecriture quiz_games" on public.quiz_games for all using (true) with check (true);

drop policy if exists "Lecture publique quiz_participants" on public.quiz_participants;
create policy "Lecture publique quiz_participants" on public.quiz_participants for select using (true);
drop policy if exists "Insertion quiz_participants" on public.quiz_participants;
create policy "Insertion quiz_participants" on public.quiz_participants for insert with check (true);
drop policy if exists "Mise a jour quiz_participants" on public.quiz_participants;
create policy "Mise a jour quiz_participants" on public.quiz_participants for update using (true) with check (true);

drop policy if exists "Lecture publique quiz_answers" on public.quiz_answers;
create policy "Lecture publique quiz_answers" on public.quiz_answers for select using (true);
drop policy if exists "Insertion quiz_answers" on public.quiz_answers;
create policy "Insertion quiz_answers" on public.quiz_answers for insert with check (true);
