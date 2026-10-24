# CONSTITUTION : Quiz & Blind Test Perso

**Version :** 1.0.0  
**Statut :** RATIFIÉ (24 octobre 2026)  
**Méthodologie :** Intent-Driven Development + Journalisation des Micro-Décisions (`DECISIONS.md`)

---

## 🏛️ 1. Principes Directeurs Fondamentaux (Non-Négociables)

### Article I — Double Expérience : Écran Hôte Spectacle & Manette Mobile Instantanée
1. **Écran Hôte (`/host`) pensé pour la TV / le Salon** : Lisibilité à 3 mètres, QR code géant, Code PIN clair, lecteur audio intégré pour le Blind Test, compte à rebours visuel et révélation théâtrale des réponses et du podium.
2. **Manette Joueur (`/game/[id]` et `/`) au pouce** : Zéro création de compte, entrée par scan QR ou code PIN + pseudo en moins de 5 secondes, gros boutons de réponse colorés optimisés pour mobile.

### Article II — Dualité Native Quiz & Blind Test
1. **Un seul moteur, deux ambiances** : Un même Pack de jeu (`quiz_sets`) peut contenir des questions de culture générale, des questions illustrées par image, et des extraits musicaux de Blind Test.
2. **Zéro Spoiler en Blind Test** : Tant que la manche n'est pas en état `is_answer_revealed = true`, ni le titre, ni l'artiste, ni la pochette de l'extrait ne doivent apparaître dans le DOM de la Manette Joueur ou de l'Écran Hôte.

### Article III — Symbiose Supabase & Railway avec DraftMaster
1. **Isolation stricte par préfixe `quiz_`** : Toutes les tables et vues résident dans la base Supabase de DraftMaster avec le préfixe `quiz_` pour garantir zéro collision et maintenir le projet Supabase actif (anti-pause).
2. **Temps réel natif** : L'état de la partie (`quiz_games`), l'arrivée des joueurs (`quiz_participants`) et les réponses (`quiz_answers`) sont synchronisés en temps réel via Supabase Realtime (`postgres_changes`).

### Article IV — Traçabilité Intent-Driven
1. **Mémoire continue** : Toute intention de l'auteur (`Ixx`) et toute micro-décision (`Dxx`) sont immédiatement consignées dans [`DECISIONS.md`](../DECISIONS.md).

---

## 🔒 2. Charte de Sécurité & Confidentialité

1. **Zéro Secret Versionné** : `.env` et `.env.local` sont systématiquement ignorés par Git.
2. **Clés publiques / privées** : Le client navigateur n'utilise que `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` encadrées par des politiques RLS explicites.
