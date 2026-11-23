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

   **Dernière revue d'AGENTS.md : D84**

---

## 3. Invariants Techniques (Stack Supabase + Railway)

- **Cohabitation Supabase avec DraftMaster** :
  - Le projet partage la base PostgreSQL de `DraftMaster`.
  - **Ne jamais modifier ni supprimer** les tables de DraftMaster (`magiciens_profiles`, `draft_records`, `admin_drafts`, `tournaments`, `tournament_events`, `tournament_command_receipts`, `cube_snapshot_archive`).
  - Toujours préfixer les tables et vues de ce projet par `quiz_` (`quiz_sets`, `quiz_questions`, `quiz_choices`, `quiz_games`, `quiz_participants`, `quiz_answers`, `quiz_game_results`).
- **Déploiement Railway** :
  - L'application Next.js doit pouvoir démarrer sur Railway via `npm run build` et `npm run start` (en respectant la variable `PORT` injectée par Railway).
  - « Shipper » = pousser sur `main` : Railway redéploie automatiquement l'environnement `quiz / production` (`quiz-production-6432.up.railway.app`). Les packs synchronisés en base sont jouables sans déploiement ; le code (avatars, chronique, écrans) attend le redéploiement.
  - Suivre un déploiement : CLI Railway installée et liée à ce dossier (projet `quiz`, environnement `production`, service `Quiz`). `railway status`, `railway deployment list`, `railway logs --deployment` (exécution), `railway logs --build` (build). Sans la CLI : `gh api repos/tristanlenours/Quiz/commits/<sha>/status --jq '.statuses[] | {state, description}'` (`pending` → `success` / `failure`).
  - Si la CLI répond « Unauthorized » : `railway login --browserless` affiche un code que **l'auteur** valide dans son navigateur ; un agent ne saisit jamais d'identifiants Railway.
  - Les URLs de QR code et de partage ne doivent jamais être codées en dur sur un domaine tiers : utiliser `window.location.origin` ou `NEXT_PUBLIC_APP_URL`.
- **Sécurité** :
  - Ne jamais commiter `.env` ou `.env.local`.
  - Seules l'URL Supabase et la clé **anon** atteignent le navigateur : `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`, ou `SUPABASE_URL` / `SUPABASE_ANON_KEY` injectées au runtime par `RootLayout` (`window.__QUIZ_SUPABASE__`, D18).
  - `SUPABASE_SERVICE_ROLE_KEY`, `SITE_PASSWORD`, `SOLO_PASSWORD` et les clés Gemini restent **côté serveur** (routes API, scripts, tests) : jamais dans un composant client ni une variable `NEXT_PUBLIC_*`. `SOLO_PASSWORD` (mot de passe des liens solo, D65) est choisi et ajouté par l'auteur ; sans lui, c'est `SITE_PASSWORD` qui protège le solo.
- **Live intact** (I20) : le quiz multi est la référence. Une évolution du solo ou des scores ne modifie pas l'Écran Hôte, la Manette ni le Salon, sauf nécessité, et le lancement normal « ▶ Lancer la partie » n'écrit aucune nouvelle colonne.

---

## 4. Écrans, médias & anti-spoil

- **Écran Hôte (TV) = seul diffuseur de médias** : image, extrait YouTube, son (D19, D26).
- **Manette Joueur = texte seul** : la question et les 4 réponses, sans image de question, vidéo, son ni pochette, pour un rendu garanti sur tous les téléphones (D31). Seuls les avatars s'y affichent.
- **Écran Solo (`/solo/[setId]`) = seul écran de la partie** : il diffuse donc lui-même image, extrait YouTube (recadré) et son, avec le cadencement et le barème du live (`src/scoring.ts`, D62). Cette exception ne s'étend pas à la Manette live.
- **Party-Game TV « Downing Street Groove » (`/host/groove/[id]` & `/groove/[id]`, `src/groove.ts`, D71)** : mini-jeu de course « 1, 2, 3 Soleil » isolé du quiz live. Sa session `quiz_games` porte `current_question_sequence = -1` et `is_training = true` (jamais de repli sans `is_training` ; `fetchPackScores` exclut aussi la séquence -1) pour ne jamais entrer dans le tableau des scores des packs et rediriger automatiquement depuis `/` vers `/groove/[id]`. Comme au quiz live, seul l'Écran Hôte (TV) diffuse la musique et les effets sonores, et aucun texte ni titre affiché ne doit divulgâcher une réponse du Grand Quiz Love Actually. **Exception assumée (D73)** : la musique est celle de la scène, réponse de la manche Blind Test n° 2 du Grand Quiz ; le Groove se lance donc après le Grand Quiz (avertissement du Studio, à ne pas retirer). Décor de Noël (sapin, guirlande, neige) dans `src/components/GrooveDecor.tsx` ; la manette tient en `100dvh`, touches au milieu de l'écran. Scène de la danse (couloir, double porte, secrétaire, escalier aux portraits) dans `src/components/DowningStreetScene.tsx`, dessins originaux : pas de photo de l'actrice. Cycle de la porte : `dancing` → `warning` (la musique baisse) → `watching` (elle observe) → parfois `lingering` (la musique repart mais elle est encore là : tout pas est sanctionné) → `dancing` (D75). **Écran TV** : dessiné pour 1920×1080 et mis à l'échelle par la taille de police racine (D76) ; y écrire les tailles en rem (ou en vh pour la piste), jamais en px fixes. La course tient en `100dvh` jusqu'à 15 danseurs (décor et couloirs se partagent la hauteur) ; la cible réelle est une Surface Pro 7 recopiée sur la TV, soit 1368×912 en plein écran.
- **Prénom obligatoire** (D72) : Salon (quiz live, Groove) et solo refusent un prénom vide ; le prénom est gardé dans le cookie `quiz_player_name` (`src/playerName.ts`) et pré-remplit le jeu suivant. Tout nouvel écran d'inscription réutilise ces helpers. Les tests E2E saisissent toujours un prénom.
- **Scores** (D63 à D65) : `quiz_games.play_mode` (`live`/`solo`) et `is_training`. Le tableau (`src/leaderboard.ts`) ignore le training, classe chaque joueur d'une partie live terminée, et ne classe d'une personne (appareil ou prénom saisi) que sa toute première partie solo, si elle est terminée.
- **Barème : la bonne réponse prime** (D82) : `src/scoring.ts` donne 1000 points par bonne réponse plus un bonus de vitesse de 0 à 25, pour qu'une bonne réponse de plus batte toujours la vitesse. Garantie valable jusqu'à 39 manches actives (test 12 de `npm test`) ; au-delà, baisser `MAX_SPEED_BONUS`. Tout code qui déduit une vitesse d'un score passe par `timeShareFromScore` (ou recopie sa formule, comme `src/soloAnalysis.ts`, importé tel quel par Node).
- **Un pack qui change perd ses scores** (D70) : dès qu'une question, un choix, un média, un calage ou l'activation d'une manche change, toutes les parties du pack sont effacées (`purgePackScores` dans `src/leaderboard.ts`). C'est automatique dans `pack:sync --apply`, à l'enregistrement dans l'éditeur du Studio et sur l'interrupteur d'une manche ; tout nouveau chemin qui modifie un pack doit faire de même. Changer seulement le nom ou la description n'efface rien.
- **Médias dès l'affichage de la question** (D81) : sur la TV et en solo, son et extrait vidéo partent avec la question, pendant les 5 s de lecture, et ne redémarrent pas à l'arrivée des choix (lecture et réponse partagent la même zone média). L'extrait garde son calage, finit donc avant le chrono, et `useExtractEnded` (`src/useExtractEnded.ts`) le retire une fois terminé pour ne pas laisser les suggestions YouTube à l'écran. Ne pas repousser ce départ à l'apparition des choix.
- **Délai avant les choix par univers** (D83) : 5 s partout (`TIME_TIL_CHOICE_REVEAL`), sauf l'univers `lives` (10 s d'écoute). Ne jamais lire la constante directement dans un écran : passer par `getChoiceRevealMs(themeId)` (`src/constants.ts`), sur l'Écran Hôte, la Manette (qui reçoit `themeId`) et l'Écran Solo, pour que les décomptes restent synchronisés. L'univers `lives` joue aussi chaque manche jusqu'au bout (`playsFullRound`, D84) : pas de révélation quand tout le monde a répondu, extrait de 70 s depuis 0:02 couvrant écoute et chrono (`getExtractDurationSec`), réponse verrouillée en solo. La durée d'un extrait se lit toujours via `getExtractDurationSec`.
- **Extraits YouTube** : vérifier qu'ils sont intégrables (oEmbed HTTP 200 et `playableInEmbed: true` **ne suffisent pas** : un ayant droit comme FIFA peut bloquer l'intégration, `tests/e2e/videos-embed.spec.ts` le détecte, D47) et caler `audio_start_sec` / `audio_duration_sec` pour que l'extrait **ne montre pas la réponse** (l'extrait s'arrête à début + temps de réponse).
- **Titre YouTube** : l'Écran Hôte zoome la vidéo pour sortir du cadre le titre incrusté par le lecteur, qui peut donner la réponse (D48). Ne pas retirer ce recadrage.
- **Son** : extraits iTunes (`audio-ssl.itunes.apple.com`, 30 s) et pochettes `mzstatic.com` en `600x600bb`.
- **Zéro spoil hors des questions** : sous-titres d'avatars (`src/avatars.ts`), citation et playlist du Salon (`src/themes.ts`), chronique déterministe et prompt Gemini (`src/app/api/game-analysis/route.ts`) ne doivent dévoiler **aucune réponse** d'un pack du même thème. Le Warm-Up ne recoupe pas le Grand Quiz (D30).
- **Thèmes** : un pack porte son univers dans `quiz_sets.avatar_theme` (`love_actually`, `harry_potter`, `retro_2026`) ; habillage dans `src/themes.ts`, avatars dans `src/avatars.ts` (préfixes `hp_` et `r26_`, D29, D46). Un nouveau thème doit aussi avoir sa chronique et son prompt dans `src/app/api/game-analysis/route.ts`, sinon il hérite de ceux de Love Actually, ainsi que sa voix et son ton de commentaire solo dans `src/soloAnalysis.ts` (sinon voix neutre). Le commentaire solo ne parle que des statistiques du joueur ; le test 9 de `npm test` refuse tout texte contenant une bonne réponse du même univers.
- **Thème Harry Potter = ton « à peu près »** : vrais noms, descriptions très approximatives de quelqu'un qui a vu les films de loin (avatars, Salon, chronique, prompt Gemini). Ne pas le corriger (D41).
- **Avatars = photos des personnages des films**, ou de vraies personnes pour Rétro 2026 (Wikimedia Commons, crédits dans D46), hébergées dans `quiz-media/avatars/<univers>/` (pas de lien direct vers un site tiers ni de portrait généré, D34). Sous-titres sans accusation sur des personnes réelles.
- **15 personnages maximum par univers**, pour que le choix d'avatar tienne sans ascenseur imbriqué : sur la manette, seule la page défile (D35).
- **Jamais l'univers d'un autre pack à l'écran** : tant que le thème du pack n'est pas résolu, ne pas se rabattre sur le thème par défaut ; afficher un écran neutre (D34).

---

## 5. Packs de questions

- `packs/*.json` est la **source de vérité** du contenu (format Import/Export du Studio, D09). Toute modification d'un pack se fait dans le JSON **puis** en base, dans le même tour de travail.
- Règles de contenu : **4 choix et 1 seule bonne réponse** par question ; faits vérifiés sur une source (script, transcript) avant d'être posés ; un fait invérifiable est signalé dans `DECISIONS.md`. Dans le pack « Vrai Connaisseur », le vocabulaire est volontairement faux (cape du maraudeur, nain géant, rouquin malin, Serpanthères, Poufsouf) : ne pas le « corriger » (D36).
- Mise en base d'un pack existant : `npm run pack:sync -- packs/<pack>.json` (simulation), puis `--apply`. La mise à jour se fait **sur place** pour conserver l'identifiant du pack (les liens solo et scores en dépendent) ; elle annonce en simulation, puis efface avec `--apply`, les parties du pack dès que le jeu change (D70). Ajouter `--set-id <uuid>` si le pack a été renommé. Un nouveau pack s'importe depuis le Studio (`/host/dashboard`) ou avec `--create`. Le script refuse de supprimer des questions : pour raccourcir un pack déjà joué, **désactiver** les manches (`"is_disabled": true` dans le JSON, ou l'interrupteur du Studio), sans les effacer (D38). Toute lecture de questions pour jouer doit exclure `is_disabled` et renuméroter `order` selon la position jouée.
- **Piège (D79)** : un pack réenregistré depuis le Studio a des choix au même `created_at`. `pack:sync` les compare et les réécrit triés par identifiant : la simulation annonce alors des questions changées alors que seul l'ordre diffère, et `--apply` remélange les réponses. Avant d'appliquer, comparer le JSON à la base ; si l'écart ne porte que sur l'ordre des choix, reporter l'ordre de la base dans le JSON et n'écrire en base que les champs modifiés, puis purger les scores (D70).
- Après un changement de pack, mettre à jour les attentes des tests (nombre de questions, nom du pack).

---

## 6. Commandes de Développement & Qualité

- `npm run dev` — Serveur de développement Next.js (`http://localhost:3000`).
- `npm run build` — Compilation de production Next.js + vérification TypeScript.
- `npm run lint` — Vérification ESLint.
- `npm test` — Intégrité des packs en base (choix, bonne réponse unique, médias accessibles en HTTP), avatars, partie simulée, moteur d'analyse. Rapide, contre la vraie base Supabase.
- `npm run test:e2e:light` — Grand Quiz sur un tirage aléatoire de 5 manches (`-- 8` pour en changer le nombre), joué sur un pack temporaire « E2E light » supprimé à la fin. Pour itérer vite ; `E2E_SEED` rejoue un tirage. Ne remplace pas le test complet avant livraison (D45).
- `npm run test:e2e` — Parties complètes en navigateur (Playwright) sur toutes les questions actives : 1 TV + 4 manettes sur la vraie base, pour le Warm-Up et le Grand Quiz, plus une partie solo du Warm-Up sur téléphone (`tests/e2e/solo-game.spec.ts`) (~17 min). Lance son propre `next dev` sur le port 3100 ; `E2E_BASE_URL` cible un serveur existant, `E2E_KEEP_GAME=1` conserve la partie de test. Le moteur commun est `tests/e2e/full-game.ts`, avec un fichier de scénario par pack.

**Fiabilité avant tout** (I13) : avant de livrer une modification de jeu ou d'écran, `npm test` **et** `npm run test:e2e` doivent passer. Pour un simple ajout de contenu (question, média, texte d'un pack), pas de `test:e2e` : `npm test` suffit (D48). Pour une retouche limitée au Groove (`src/app/groove/`, `src/app/host/groove/`, `src/groove.ts`, `src/components/GrooveDecor.tsx`), `npm test` et `npx playwright test tests/e2e/groove-game.spec.ts` suffisent, sans attendre la suite complète (D74). Ne jamais lancer `npm run build` pendant un E2E : le build et `next dev` partagent `.next`. **Toute partie créée par un test est en training** (`is_training: true`, bouton « 🧪 Training », `?training=1`) ; une partie classée de test ne se joue que sur un pack temporaire supprimé à la fin (D64). Le Chromium de Playwright ne lit ni l'AAC ni le H.264 : les tests vérifient la présence et le calage des médias, **pas leur lecture effective**, à contrôler en répétition sur la vraie TV.
