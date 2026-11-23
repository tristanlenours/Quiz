'use client'

import { VIDEO_END_GRACE_MS } from '@/constants'
import { useEffect, useState } from 'react'

/**
 * Vrai quand l'extrait YouTube d'une manche est terminé (D81).
 *
 * L'extrait part dès l'affichage de la question, pendant la lecture, et garde son calage
 * (début → début + temps de réponse) : il finit donc avant le chrono. Passé ce délai,
 * l'écran retire la vidéo, sans quoi YouTube afficherait ses suggestions, dont les titres
 * peuvent donner la réponse.
 */
export function useExtractEnded(questionId: string, playing: boolean, durationSec: number) {
  const [ended, setEnded] = useState(false)
  useEffect(() => {
    setEnded(false)
    if (!playing) return
    const timer = setTimeout(() => setEnded(true), durationSec * 1000 + VIDEO_END_GRACE_MS)
    return () => clearTimeout(timer)
  }, [questionId, playing, durationSec])
  return ended
}
