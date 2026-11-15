-- Parties solo et mode training (Décisions D62 à D64)
-- Idempotent, ne touche qu'à quiz_games (aucune table DraftMaster).
-- La vue quiz_game_results n'est pas modifiée.

alter table public.quiz_games
  add column if not exists play_mode text not null default 'live';

alter table public.quiz_games
  add column if not exists is_training boolean not null default false;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'quiz_games_play_mode_check'
  ) then
    alter table public.quiz_games
      add constraint quiz_games_play_mode_check check (play_mode in ('live', 'solo'));
  end if;
end $$;

create index if not exists idx_quiz_games_set_mode
  on public.quiz_games (quiz_set_id, play_mode);
