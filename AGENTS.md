# Instructions Agents — Quiz & Blind Test (Intent-Driven)

Ce dépôt suit une méthodologie **Intent-Driven Development**. L'auteur exprime ses intentions et arbitre les micro-décisions ; les agents exécutent, proposent des options claires et tiennent à jour la mémoire architecturale du projet.

---

## 1. Lire avant d'agir

Avant toute modification de schéma, d'interface ou de logique de jeu, lire :
1. [`CONTEXT.md`](./CONTEXT.md) — Vocabulaire canonique (Quiz & Blind Test) et architecture mutualisée avec **DraftMaster**.
2. [`DECISIONS.md`](./DECISIONS.md) — Intentions de l'auteur (`Ixx`), micro-décisions adoptées (`Dxx`) et questions ouvertes (`Qxx`).
3. [`.specify/constitution.md`](./.specify/constitution.md) — Principes non-négociables (Mobile-first manette, Zéro collision Supabase avec DraftMaster, Zéro secret commité).

---

## 2. Règles du Pilotage Intent-Driven & Micro-Décisions

1. **Capturer l'intention avant le code** :
   Lorsqu'une demande de l'auteur introduit une nouvelle intention ou tranche une question ouverte, mettre à jour [`DECISIONS.md`](./DECISIONS.md) (sections *Intentions Explicites*, *Registre des Micro-Décisions* et *Journal Chronologique*) dans le même tour de travail.
2. **Tracer chaque micro-décision technique ou UX (`Dxx`)** :
   Tout choix structurant (nouvelle colonne SQL, règle de calcul de score, source audio, comportement du timer, mode de réponse) doit être logué dans [`DECISIONS.md`](./DECISIONS.md) avec :
   - **Date & ID (`Dxx`)**
   - **Contexte**
   - **Décision retenue & Raison**
   - **Alternatives écartées / laissées ouvertes**
3. **Ne pas écraser silencieusement** :
   Si une nouvelle orientation remplace une décision précédente, marquer l'ancienne décision comme `Remplacée par Dyy` dans `DECISIONS.md` plutôt que de l'effacer.
4. **Distinguer les statuts** :
   Séparer clairement ce qui relève d'une `Intention auteur` (`Ixx`), d'une `Décision adoptée` (`Dxx`) et d'une `Question ouverte` (`Qxx`).

---

## 3. Invariants Techniques (Stack Supabase + Railway)

- **Cohabitation Supabase avec DraftMaster** :
  - Le projet partage la base PostgreSQL de `DraftMaster`.
  - **Ne jamais modifier ni supprimer** les tables de DraftMaster (`magiciens_profiles`, `draft_records`, `admin_drafts`, `tournaments`, `tournament_events`, `tournament_command_receipts`, `cube_snapshot_archive`).
  - Toujours préfixer les tables et vues de ce projet par `quiz_` (`quiz_sets`, `quiz_questions`, `quiz_choices`, `quiz_games`, `quiz_participants`, `quiz_answers`, `quiz_game_results`).
- **Déploiement Railway** :
  - L'application Next.js doit pouvoir démarrer sur Railway via `npm run build` et `npm run start` (en respectant la variable `PORT` injectée par Railway).
  - Les URLs de QR code et de partage ne doivent jamais être codées en dur sur un domaine tiers : utiliser `window.location.origin` ou `NEXT_PUBLIC_APP_URL`.
- **Sécurité** :
  - Ne jamais commiter `.env` ou `.env.local`.
  - Seules `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` sont exposées au client navigateur.

---

## 4. Commandes de Développement & Qualité

- `npm run dev` — Serveur de développement Next.js (`http://localhost:3000`).
- `npm run build` — Compilation de production Next.js + vérification TypeScript.
- `npm run lint` — Vérification ESLint.
