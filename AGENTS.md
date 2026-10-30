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
5. **Tenir ce fichier à jour au fil de l'eau** :
   À chaque nouvelle décision `Dxx`, se demander si elle crée, change ou rend caduque une règle de travail durable (commande, convention, invariant, piège connu). Si oui, mettre à jour `AGENTS.md` **dans le même tour de travail**, sans attendre une révision d'ensemble ; une règle caduque est corrigée ou retirée, pas laissée en place.
   Dans tous les cas, avancer le marqueur ci-dessous jusqu'à la dernière décision relue. `npm test` échoue tant qu'une décision de `DECISIONS.md` est plus récente que ce marqueur.

   **Dernière revue d'AGENTS.md : D51**

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
  - Seules l'URL Supabase et la clé **anon** atteignent le navigateur : `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`, ou `SUPABASE_URL` / `SUPABASE_ANON_KEY` injectées au runtime par `RootLayout` (`window.__QUIZ_SUPABASE__`, D18).
  - `SUPABASE_SERVICE_ROLE_KEY`, `SITE_PASSWORD` et les clés Gemini restent **côté serveur** (routes API, scripts, tests) : jamais dans un composant client ni une variable `NEXT_PUBLIC_*`.

---

## 4. Écrans, médias & anti-spoil

- **Écran Hôte (TV) = seul diffuseur de médias** : image, extrait YouTube, son (D19, D26).
- **Manette Joueur = texte seul** : la question et les 4 réponses, sans image de question, vidéo, son ni pochette, pour un rendu garanti sur tous les téléphones (D31). Seuls les avatars s'y affichent.
- **Extraits YouTube** : vérifier qu'ils sont intégrables (oEmbed HTTP 200 et `playableInEmbed: true` **ne suffisent pas** : un ayant droit comme FIFA peut bloquer l'intégration, `tests/e2e/videos-embed.spec.ts` le détecte, D47) et caler `audio_start_sec` / `audio_duration_sec` pour que l'extrait **ne montre pas la réponse** (l'extrait s'arrête à début + temps de réponse).
- **Titre YouTube** : l'Écran Hôte zoome la vidéo pour sortir du cadre le titre incrusté par le lecteur, qui peut donner la réponse (D48). Ne pas retirer ce recadrage.
- **Son** : extraits iTunes (`audio-ssl.itunes.apple.com`, 30 s) et pochettes `mzstatic.com` en `600x600bb`.
- **Zéro spoil hors des questions** : sous-titres d'avatars (`src/avatars.ts`), citation et playlist du Salon (`src/themes.ts`), chronique déterministe et prompt Gemini (`src/app/api/game-analysis/route.ts`) ne doivent dévoiler **aucune réponse** d'un pack du même thème. Le Warm-Up ne recoupe pas le Grand Quiz (D30).
- **Thèmes** : un pack porte son univers dans `quiz_sets.avatar_theme` (`love_actually`, `harry_potter`, `retro_2026`) ; habillage dans `src/themes.ts`, avatars dans `src/avatars.ts` (préfixes `hp_` et `r26_`, D29, D46). Un nouveau thème doit aussi avoir sa chronique et son prompt dans `src/app/api/game-analysis/route.ts`, sinon il hérite de ceux de Love Actually.
- **Thème Harry Potter = ton « à peu près »** : vrais noms, descriptions très approximatives de quelqu'un qui a vu les films de loin (avatars, Salon, chronique, prompt Gemini). Ne pas le corriger (D41).
- **Avatars = photos des personnages des films**, ou de vraies personnes pour Rétro 2026 (Wikimedia Commons, crédits dans D46), hébergées dans `quiz-media/avatars/<univers>/` (pas de lien direct vers un site tiers ni de portrait généré, D34). Sous-titres sans accusation sur des personnes réelles.
- **15 personnages maximum par univers**, pour que le choix d'avatar tienne sans ascenseur imbriqué : sur la manette, seule la page défile (D35).
- **Jamais l'univers d'un autre pack à l'écran** : tant que le thème du pack n'est pas résolu, ne pas se rabattre sur le thème par défaut ; afficher un écran neutre (D34).

---

## 5. Packs de questions

- `packs/*.json` est la **source de vérité** du contenu (format Import/Export du Studio, D09). Toute modification d'un pack se fait dans le JSON **puis** en base, dans le même tour de travail.
- Règles de contenu : **4 choix et 1 seule bonne réponse** par question ; faits vérifiés sur une source (script, transcript) avant d'être posés ; un fait invérifiable est signalé dans `DECISIONS.md`. Dans le pack « Vrai Connaisseur », le vocabulaire est volontairement faux (cape du maraudeur, nain géant, rouquin malin, Serpanthères, Poufsouf) : ne pas le « corriger » (D36).
- Mise en base d'un pack existant : `npm run pack:sync -- packs/<pack>.json` (simulation), puis `--apply`. La mise à jour se fait **sur place** pour conserver les identifiants et l'historique `quiz_answers` ; ajouter `--set-id <uuid>` si le pack a été renommé. Un nouveau pack s'importe depuis le Studio (`/host/dashboard`) ou avec `--create`. Le script refuse de supprimer des questions : pour raccourcir un pack déjà joué, **désactiver** les manches (`"is_disabled": true` dans le JSON, ou l'interrupteur du Studio), sans les effacer (D38). Toute lecture de questions pour jouer doit exclure `is_disabled` et renuméroter `order` selon la position jouée.
- Après un changement de pack, mettre à jour les attentes des tests (nombre de questions, nom du pack).

---

## 6. Commandes de Développement & Qualité

- `npm run dev` — Serveur de développement Next.js (`http://localhost:3000`).
- `npm run build` — Compilation de production Next.js + vérification TypeScript.
- `npm run lint` — Vérification ESLint.
- `npm test` — Intégrité des packs en base (choix, bonne réponse unique, médias accessibles en HTTP), avatars, partie simulée, moteur d'analyse. Rapide, contre la vraie base Supabase.
- `npm run test:e2e:light` — Grand Quiz sur un tirage aléatoire de 5 manches (`-- 8` pour en changer le nombre), joué sur un pack temporaire « E2E light » supprimé à la fin. Pour itérer vite ; `E2E_SEED` rejoue un tirage. Ne remplace pas le test complet avant livraison (D45).
- `npm run test:e2e` — Parties complètes en navigateur (Playwright) sur toutes les questions actives : 1 TV + 4 manettes sur la vraie base, pour le Warm-Up et le Grand Quiz (~15 min). Lance son propre `next dev` sur le port 3100 ; `E2E_BASE_URL` cible un serveur existant, `E2E_KEEP_GAME=1` conserve la partie de test. Le moteur commun est `tests/e2e/full-game.ts`, avec un fichier de scénario par pack.

**Fiabilité avant tout** (I13) : avant de livrer une modification de jeu ou d'écran, `npm test` **et** `npm run test:e2e` doivent passer. Pour un simple ajout de contenu (question, média, texte d'un pack), pas de `test:e2e` : `npm test` suffit (D48). Ne jamais lancer `npm run build` pendant un E2E : le build et `next dev` partagent `.next`. Le Chromium de Playwright ne lit ni l'AAC ni le H.264 : les tests vérifient la présence et le calage des médias, **pas leur lecture effective**, à contrôler en répétition sur la vraie TV.
