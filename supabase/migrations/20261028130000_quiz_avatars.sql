-- ==============================================================================
-- Migration D21 : Thèmes d'avatars ("Love Actually") & Avatars exclusifs par partie
-- ==============================================================================
-- Zéro impact sur les tables DraftMaster. Idempotent.
-- ==============================================================================

-- 1. Thème d'avatars associé au pack (défaut : 'love_actually')
alter table public.quiz_sets
    add column if not exists avatar_theme text default 'love_actually' not null;

-- 2. Avatar choisi par chaque participant dans une partie
alter table public.quiz_participants
    add column if not exists avatar_id text;

-- 3. Unicité de l'avatar au sein d'une même session de jeu (quand un avatar est choisi)
create unique index if not exists idx_quiz_participants_unique_avatar
    on public.quiz_participants (game_id, avatar_id)
    where avatar_id is not null;

-- 4. Autoriser la mise à jour d'un participant (changement d'avatar dans le salon)
drop policy if exists "Mise a jour quiz_participants" on public.quiz_participants;
create policy "Mise a jour quiz_participants"
    on public.quiz_participants for update using (true) with check (true);

-- 5. Mise à jour de la vue des résultats pour exposer `avatar_id` sur le podium
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
