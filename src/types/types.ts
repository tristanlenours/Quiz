import { createClient } from '@supabase/supabase-js'
import { Database } from './supabase'

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

export type Participant = Database['public']['Tables']['quiz_participants']['Row']

export type Choice = Database['public']['Tables']['quiz_choices']['Row']

export type Question = Database['public']['Tables']['quiz_questions']['Row'] & {
  choices: Choice[]
}

export type QuizSet = Database['public']['Tables']['quiz_sets']['Row'] & {
  questions: Question[]
}

export type Answer = Database['public']['Tables']['quiz_answers']['Row']

export type Game = Database['public']['Tables']['quiz_games']['Row']

export type GameResult = Database['public']['Views']['quiz_game_results']['Row']

/**
 * Génère ou récupère un identifiant de session client persistant dans localStorage
 * pour permettre aux joueurs de rejoindre une partie sans dépendre d'Anonymous Auth (Décision D05).
 */
export function getClientSessionId(): string {
  if (typeof window === 'undefined') return 'ssr-session'
  const key = 'quiz_client_session_id'
  let sessionId = window.localStorage.getItem(key)
  if (!sessionId) {
    sessionId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `sess_${Math.random().toString(36).slice(2)}_${Date.now()}`
    window.localStorage.setItem(key, sessionId)
  }
  return sessionId
}
