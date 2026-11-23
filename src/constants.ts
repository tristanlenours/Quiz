/** Time until the choices for the question are revealed in ms */
export const TIME_TIL_CHOICE_REVEAL = 5000
/** Default answer time / excerpt duration of a question in seconds (Décision D20) */
export const DEFAULT_QUESTION_DURATION_SEC = 30
/**
 * Marge laissée au lecteur YouTube pour charger avant de masquer un extrait terminé (D81) :
 * l'extrait part dès l'affichage de la question, il finit donc avant le chrono.
 */
export const VIDEO_END_GRACE_MS = 1000
/** Time that the users have to answer a question in ms */
export const QUESTION_ANSWER_TIME = DEFAULT_QUESTION_DURATION_SEC * 1000
