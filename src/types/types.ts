import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Database } from './supabase'

declare global {
  interface Window {
    __QUIZ_SUPABASE__?: {
      url?: string
      anonKey?: string
    }
  }
}

function resolveSupabaseCredentials(): {
  url: string
  anonKey: string
  configured: boolean
} {
  const runtimeUrl =
    typeof window !== 'undefined' ? window.__QUIZ_SUPABASE__?.url : undefined
  const runtimeKey =
    typeof window !== 'undefined'
      ? window.__QUIZ_SUPABASE__?.anonKey
      : undefined

  const url = (
    runtimeUrl ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    ''
  )
    .trim()
    .replace(/^["']|["']$/g, '')

  const anonKey = (
    runtimeKey ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    ''
  )
    .trim()
    .replace(/^["']|["']$/g, '')

  const configured = Boolean(
    url &&
      anonKey &&
      url.startsWith('http') &&
      !url.includes('placeholder.supabase.co')
  )

  return {
    url: configured ? url : 'https://placeholder.supabase.co',
    anonKey: configured ? anonKey : 'placeholder-anon-key',
    configured,
  }
}

let cachedBrowserClient: SupabaseClient<Database> | null = null
let cachedBrowserUrl: string | null = null

export function setRuntimeSupabaseConfig(url?: string, anonKey?: string) {
  if (typeof window !== 'undefined' && url && anonKey) {
    window.__QUIZ_SUPABASE__ = { url, anonKey }
    cachedBrowserClient = null
    cachedBrowserUrl = null
  }
}

export function isSupabaseClientConfigured(): boolean {
  return resolveSupabaseCredentials().configured
}

export const supabase: SupabaseClient<Database> = new Proxy(
  {} as SupabaseClient<Database>,
  {
    get(_target, prop, receiver) {
      const creds = resolveSupabaseCredentials()
      if (typeof window === 'undefined') {
        const ssrClient = createClient<Database>(creds.url, creds.anonKey)
        return Reflect.get(ssrClient, prop, receiver)
      }
      if (!cachedBrowserClient || cachedBrowserUrl !== creds.url) {
        cachedBrowserClient = createClient<Database>(creds.url, creds.anonKey)
        cachedBrowserUrl = creds.url
      }
      const value = Reflect.get(cachedBrowserClient, prop, receiver)
      return typeof value === 'function'
        ? value.bind(cachedBrowserClient)
        : value
    },
  }
)

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

/**
 * Précharge les illustrations de toutes les questions d'un pack pour qu'elles
 * s'affichent instantanément à l'apparition de chaque question (Décision D17).
 */
export function preloadQuestionImages(questions: Question[] | undefined) {
  if (typeof window === 'undefined' || !questions) return
  questions.forEach((q) => {
    if (q.image_url) new window.Image().src = q.image_url
  })
}

/**
 * Construit l'URL d'intégration YouTube d'un extrait vidéo (Décision D19) :
 * lecture automatique de `startSec` à `startSec + durationSec`, sans suggestions.
 * Retourne null si l'URL n'est pas un lien YouTube reconnu.
 */
export function getYouTubeEmbedUrl(
  url: string | null | undefined,
  startSec: number,
  durationSec: number
): string | null {
  if (!url) return null
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/
  )
  if (!match) return null
  const params = new URLSearchParams({
    autoplay: '1',
    start: String(startSec),
    end: String(startSec + durationSec),
    controls: '0',
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  })
  return `https://www.youtube.com/embed/${match[1]}?${params.toString()}`
}
