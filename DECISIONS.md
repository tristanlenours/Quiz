# Journal des Intentions & Micro-Décisions (ADR)

Ce fichier est la **mémoire vivante ("Intent-Driven")** du projet.
Chaque intention exprimée par l'auteur et chaque micro-décision technique, produit ou UX prise au fil du temps y sont consignées avec leur contexte, l'option retenue, les alternatives écartées et leurs conséquences.

---

## 1. Intentions Explicites de l'Auteur

| ID | Date | Intention | Origine | Statut |
| :--- | :--- | :--- | :--- | :--- |
| **I01** | 2026-10-24 | Créer un "Kahoot-like" personnel en capitalisant sur l'écosystème existant (comptes Supabase et Railway de DraftMaster). | Brief initial auteur | Actif |
| **I02** | 2026-10-24 | Partir d'une base open-source éprouvée (`supabase-community/kahoot-alternative`) en Next.js / React / Tailwind / Supabase Realtime. | Arbitrage auteur | Actif |
| **I03** | 2026-10-24 | Intégrer nativement un mode **Blind Test musical** en plus du Quiz classique. | Demande explicite auteur | Actif |
| **I04** | 2026-10-24 | Mutualiser la **même base de données Supabase que DraftMaster** pour éviter la dispersion des comptes et **garder la base active** (éviter la mise en pause d'inactivité Supabase). | Demande explicite auteur | Actif |
| **I05** | 2026-10-24 | Adopter un pilotage **Intent-Driven** et journaliser systématiquement les micro-décisions prises au fil de l'eau (et poser les questions d'arbitrage directement dans le chat). | Demande explicite auteur | Actif |
| **I06** | 2026-10-24 | Créer un pack « Rétro 2026 » mêlant questions et **extraits vidéo** (ex : clip « STORM » de GENER8ION, « Qui est le réalisateur de ce clip ? », extrait de 30 s à partir de 4:20). | Demande explicite auteur | Actif |
| **I07** | 2026-10-28 | Retrouver le côté fun de Kahoot avec le choix d'un **avatar exclusif** visible à tous les étages (salon, manches, révélation avec mini-podium, et podium final), inauguré par un thème **« Love Actually »** (15 personnages du film, chaque personnage pris n'étant plus disponible pour les autres joueurs). | Demande explicite auteur | Actif |
| **I08** | 2026-10-28 | Ajouter une **analyse fun des résultats** en fin de partie (chronique humoristique de la partie + trophées/badges spéciaux), propulsée par les clés gratuites **Gemini** avec une **analyse déterministe en fallback**. | Demande explicite auteur | Actif |
| **I09** | 2026-10-28 | Créer un pack **« Love Actually — Warm-Up ❤️🎄 » de 5 questions** plus accessibles mais couvrant tous les formats (Image, Blind Test audio, Vidéo YouTube, Son + Image), accompagné d'une **vraie ambiance sonore et visuelle hommage au film culte** (musique d'ambiance dans le salon et sur le podium, citations cultes, décor de Noël) et de **tests automatisés** pour éviter tout bug pendant la soirée. | Demande explicite auteur | Actif |
| **I10** | 2026-10-28 | Disposer d'un **vrai test E2E navigateur** du Warm-Up Love Actually simulant une soirée complète à **4 participants** (réponses éclair, chrono de 30 s épuisé, joueurs qui ne répondent pas) côté Hôte **et** manettes, jusqu'au **podium et à l'analyse**, en **contrôlant le cadencement des manches et l'affichage des réponses**. | Demande explicite auteur | Actif |
| **I11** | 2026-10-28 | Créer un petit **quiz Harry Potter de 10 questions assez difficiles et fun**, avec **vidéos et musique**, des **avatars pour incarner son personnage** « à la manière de Love Actually » et une **analyse post-game bien role play**. | Demande explicite auteur | Actif |
| **I12** | 2026-10-29 | Améliorer la forme du grand quiz Love Actually (portage Kahoot) : y glisser **parfois des vidéos ou du son** comme dans le Warm-Up, garantir **une et une seule bonne réponse** par question avec **4 choix** partout, et rendre le **Warm-Up plus simple** et **sans doublon** avec le grand quiz. | Demande explicite auteur | Actif |
| **I13** | 2026-10-29 | **La fiabilité est la clé** (l'auteur est QA, sa réputation est en jeu) : sur les manettes, **uniquement la question et les réponses**, sans image ni vidéo, pour un affichage correct sur tous les téléphones ; un **test E2E navigateur du Grand Quiz** au même niveau d'exigence que celui du Warm-Up ; une vidéo sur la question Billy Mack. | Demande explicite auteur | Actif |
| **I14** | 2026-10-29 | **Favoriser la mise à jour régulière d'`AGENTS.md`** au gré des évolutions du projet, plutôt que par révisions ponctuelles. | Demande explicite auteur | Actif |
| **I15** | 2026-10-29 | Pour le quiz Harry Potter, **des photos des personnages des films** plutôt que des avatars dessinés ; et **jamais les avatars d'un autre quiz** à l'écran, même un instant : mieux vaut ne rien afficher. | Demande explicite auteur | Actif |

---

## 2. Registre des Micro-Décisions

| ID | Date | Sujet | Décision retenue | Statut |
| :--- | :--- | :--- | :--- | :--- |
| **D01** | 2026-10-24 | Choix du socle de départ | Cloner `supabase-community/kahoot-alternative` (Next.js 14 + Supabase Realtime + Tailwind CSS) plutôt que repartir de zéro ou forker `Rahoot` (Socket.io sans Supabase). | Adopté |
| **D02** | 2026-10-24 | Stratégie de base de données | Partager le projet Supabase de DraftMaster en isolant les objets SQL du Quiz par le préfixe `quiz_` (`quiz_sets`, `quiz_questions`, `quiz_choices`, `quiz_games`, `quiz_participants`, `quiz_answers`, `quiz_game_results`). | Adopté |
| **D03** | 2026-10-24 | Gouvernance Intent-Driven | Structurer le dépôt autour du triptyque `AGENTS.md` (règles de travail), `CONTEXT.md` (domaine & vocabulaire) et `DECISIONS.md` (journal chronologique des intentions et micro-décisions). | Adopté |
| **D04** | 2026-10-24 | Modélisation hybride Quiz + Blind Test | Étendre la table des questions (`quiz_questions`) pour supporter un type de manche (`question_type`), une source audio (`audio_url`, `audio_start_sec`, `audio_duration_sec`) et des champs de révélation différée (`reveal_title`, `reveal_artist`, `reveal_cover_url`) masqués tant que `is_answer_revealed = false`. | Adopté |
| **D05** | 2026-10-24 | Connexion joueur sans friction | Permettre aux participants de rejoindre une partie avec un simple pseudo et un identifiant de session client (`client_session_id` stocké en `localStorage`), sans dépendre obligatoirement de l'activation d'Anonymous Auth dans Supabase. | Adopté |
| **D06** | 2026-10-24 | Mode de réponse en Blind Test (`Q01 -> A`) | **QCM à 4 boutons** sur mobile (ex: 4 propositions d'artistes/titres), garantissant une rapidité d'exécution maximale au pouce et zéro pénalité liée aux fautes de frappe. | Adopté |
| **D07** | 2026-10-24 | Source des extraits audio (`Q02 -> A`) | **Recherche intégrée iTunes/Deezer API** (extrait MP3 30s + pochette + titre/artiste auto-remplis et génération de 3 leurres possibles) + **URL MP3 directe / Upload Supabase Storage** (`quiz-media`) pour les extraits personnalisés. | Adopté |
| **D08** | 2026-10-24 | Diffusion sonore (`Q03 -> A`) | **Lecture audio sur l'Écran Hôte par défaut** (TV / PC relié aux enceintes du salon), avec un bouton optionnel sur la Manette Joueur. | Remplacée par **D26** |
| **D09** | 2026-10-24 | Studio d'édition & Import/Export (`Q04 -> A`) | **Studio d'édition web dans `/host/dashboard`** protégé par le mot de passe Hôte (`SITE_PASSWORD`), accompagné d'une fonction **Import / Export JSON** pour sauvegarder ou générer des packs via IA. | Adopté |
| **D10** | 2026-10-24 | Fiabilisation CSS, Synchro Hybride & Ergonomie Multi-Onglets | Supprimer le double import `globals.css` dans `/host/dashboard/layout.tsx` (qui cassait le chunk CSS Tailwind sur `/game/[id]`), ajouter un polling léger (1,5s) en complément de Supabase Realtime, et afficher des liens croisés Hôte ⇄ Manette pour faciliter le test sur un seul PC. | Adopté |
| **D11** | 2026-10-24 | Timer anti-veille d'onglet & Bouton Rejouer *(partie clic Hôte remplacée par D13)* | Remplacer `onComplete` de `requestAnimationFrame` par `setTimeout` sur `/game/[id]` pour éviter le gel des onglets en arrière-plan, et ajouter un bouton « Rejouer ce Pack » sur le podium. *(Le clic de réponse sur l'Hôte a été écarté par D13).* | Partiellement remplacé par **D13** |
| **D12** | 2026-10-24 | Mot de passe Studio Hôte dédié & Livraison GitHub/Railway | Définir le mot de passe du Studio Hôte (`SITE_PASSWORD`) sur `Quiz007!` (distinct de DraftMaster) et publier le dépôt sur GitHub (`tristanlenours/Quiz`) prêt à être déployé en 1 clic sur Railway. | Adopté |
| **D13** | 2026-10-24 | Séparation stricte Écran Hôte (TV) vs Manette Joueur | Revenir à des propositions purement visuelles (non cliquables) sur l'Écran Hôte (`/host/game/[id]`). Seules les Manettes Joueurs (`/game/[id]`) peuvent soumettre des réponses. | Adopté |
| **D14** | 2026-10-24 | Mise à niveau sécurité Next.js (`>= 14.2.35`) pour Railway Railpack | Mettre à jour `next`, `@next/mdx` et `eslint-config-next` de `14.2.15` vers `^14.2.35` afin de corriger les CVE (`CVE-2025-55184`, `CVE-2025-67779`) bloquées par le scanner de sécurité de Railway (`railpack-v0.43.0`). | Adopté |
| **D15** | 2026-10-24 | Import d'un quiz Kahoot existant | Convertir le kahoot « Do you really love Love actually ? » en pack JSON versionné (`packs/love-actually.json`) au format Import/Export du Studio (D09), images copiées dans Supabase Storage (bucket public `quiz-media`, dossier `packs/love-actually/`). | Contenu remanié par **D30** |
| **D16** | 2026-10-24 | Images des questions sur la Manette Joueur | Afficher aussi `image_url` sur `/game/[id]` (sous l'intitulé, hauteur max 30vh) pour les questions Quiz ; jamais en Blind Test pour ne rien dévoiler. | Remplacée par **D17** |
| **D17** | 2026-10-24 | Images des questions : taille, moment d'affichage, Manette Joueur | Afficher `image_url` en grand dès l'apparition de la question (y compris pendant le décompte de 5 s), sur l'Écran Hôte (jusqu'à 50vh) et sur la Manette Joueur (espace libre au-dessus des boutons) ; précharger toutes les images du pack au chargement de la partie. Jamais en Blind Test. | Partie Manette remplacée par **D31** |
| **D18** | 2026-10-24 | Injection Runtime des variables Supabase sur Railway | Injecter la configuration Supabase au runtime via `RootLayout` (`window.__QUIZ_SUPABASE__`) en acceptant aussi bien `SUPABASE_URL` / `SUPABASE_ANON_KEY` (convention DraftMaster) que `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`, afin d'éviter le piège du figeage au build de Next.js sur Railway (`Failed to fetch` sur `placeholder.supabase.co`). | Adopté |
| **D19** | 2026-10-24 | Extraits vidéo YouTube dans les questions Quiz | Nouvelle colonne `quiz_questions.video_url` ; extrait lu sur l'Écran Hôte uniquement via l'intégration YouTube (`start` / `end`), en réutilisant `audio_start_sec` (début) et `audio_duration_sec` (durée = temps de réponse). Manette : « 📺 Regardez l'écran ! ». | Message Manette retiré par **D31** |
| **D20** | 2026-10-24 | Durée par défaut 30 s & zone média agrandie | Temps de réponse / durée d'extrait par défaut passé de 20 s à 30 s (constante `DEFAULT_QUESTION_DURATION_SEC`, défaut SQL, questions existantes migrées) ; sur l'Écran Hôte, l'image ou la vidéo occupe toute la hauteur disponible et les 4 choix passent sur une ligne. | Adopté |
| **D21** | 2026-10-28 | Thèmes d'avatars exclusifs (« Love Actually » — 15 personnages) & Podium à tous les étages | Ajouter `avatar_theme` sur `quiz_sets` (défaut `'love_actually'`) et `avatar_id` sur `quiz_participants` avec contrainte SQL `UNIQUE (game_id, avatar_id)` + fallback transparent sans migration SQL obligatoire. Le joueur choisit un personnage parmi 15 + saisit son prénom (ou laisse vide). Affichage de son avatar et du podium/classement fun à tous les étages côté participant (salon, pendant la manche, entre les manches/révélation, et podium final Top 3) ainsi que sur l'Écran Hôte. | Adopté |
| **D22** | 2026-10-28 | Analyse fun de fin de partie (Gemini + Fallback déterministe) | Créer la route API `/api/game-analysis` qui agrège les statistiques réelles de la partie (`quiz_game_results`, `quiz_answers`, `quiz_questions`, avatars choisis), calcule des trophées ludiques déterministes (Lucky Luke du Buzzer, Sniper sans pitié, Remontada de Noël, Mr Bean de l'emballage...) et génère une chronique humoristique personnalisée via l'API gratuite Gemini (`GEMINI_API_KEY` / `GOOGLE_API_KEY`, modèle `gemini-2.5-flash`) avec repli instantané sur un générateur narratif déterministe si la clé est absente ou le quota atteint. Mise en cache par `gameId` et affichage sur l'Écran Hôte et la Manette Joueur. | Adopté |
| **D23** | 2026-10-28 | Pack « Love Actually — Warm-Up » (5 questions multi-formats), Ambiance sonore/visuelle & Suite de tests E2E | Créer et insérer en base le pack de chauffe de 5 questions couvrant QCM illustré + bande-son, Blind Test musical, Extrait vidéo YouTube et Grand Final musical (sans divulgâcher les 17 questions du grand quiz), enrichir le Salon + Podium d'une ambiance *Love Actually* (lecteur musical BO du film dans le salon et sur le podium, citations cultes) et ajouter la suite de tests automatisés `npm test` (`tests/quiz-e2e-flow.test.mjs`). | Adopté |
| **D24** | 2026-10-28 | Isolation des réponses par partie & Verrou anti-révélation prématurée | Dans `src/app/host/game/[id]/quiz.tsx`, filtrer `quiz_answers` par `.in('participant_id', currentParticipantIds)` (pour ne jamais compter les réponses d'anciennes parties sur la même question) et verrouiller `onTimeUp` / `getNextQuestion` via `hasRevealedRef` et `isTransitioningRef` + `key={question.id}` afin d'empêcher le polling de 1,5 s de révéler prématurément la manche suivante. | Adopté |
| **D25** | 2026-10-28 | Cycle de vie stable de l'Écran Hôte (TV), synchronisation de l'état `is_answer_revealed` & déverrouillage de `getNextQuestion` | Découpler le hook de manche de `participants` (stocké via `useRef`) pour empêcher le polling 1,5s de réinitialiser le timer de 5s en boucle (`hasShownChoices` bloqué à faux). Transmettre `is_answer_revealed` depuis `HostGamePage`, trier formellement `quizSet.questions` par `order` en JS, et rendre le bouton « ⏭️ Révéler maintenant » disponible immédiatement. | Adopté |
| **D26** | 2026-10-28 | Écran Hôte (TV) comme diffuseur sonore unique & suppression de l'audio mobile (Zéro cacophonie) | Supprimer tout élément `<audio>`, état `mobileAudioEnabled` et bouton d'écoute sur la Manette Joueur (`/game/[id]/quiz.tsx`). Toute la musique et les effets sonores (Blind Test, quiz sonorisé, salon, podium) sont joués exclusivement sur l'Écran Hôte / les enceintes de la pièce. | Adopté |
| **D27** | 2026-10-28 | Synchronisation stricte Hôte ⇄ Participants du décompte de lecture & révélation des choix (Équité totale) | Aligner le décompte de lecture sur `TIME_TIL_CHOICE_REVEAL` (5s) avec `CountdownCircleTimer` visuel identique sur TV et mobile. Révélation instantanée et simultanée des choix via canal Supabase Realtime Broadcast (`quiz_sync_${gameId}`), garantissant zéro affichage prématuré sur mobile et une équité temps réel parfaite. | Adopté |
| **D28** | 2026-10-28 | Test E2E multi-navigateurs Playwright (1 TV + 4 manettes) sur la vraie base | `@playwright/test` (1.62, Chromium) + `tests/e2e/warmup-full-game.spec.ts`, lancé par `npm run test:e2e` sur un `next dev` port 3100. Chaque écran est confronté à Supabase (réponses, scores, classement) et le cadencement est mesuré (arrivée de manche, 5 s de lecture, 30 s de chrono, retard de révélation manettes/TV). | Adopté |
| **D29** | 2026-10-28 | Thème « Harry Potter » : 18 sorciers à maisons, habillage par univers, discours de Dumbledore & Coupe des Quatre Maisons, pack de 10 manches | `src/themes.ts` habille Salon / Quiz / Podium selon le thème du pack ; 18 avatars `hp_*` à portraits SVG générés aux couleurs des maisons ; `/api/game-analysis` bascule en banquet de fin d'année (Dumbledore + Gazette du Sorcier + Coupe des Quatre Maisons à la moyenne). Thème lu dans `quiz_sets.avatar_theme`, sinon déduit du nom du pack (migration D21 non jouée en base). | Adopté |
| **D30** | 2026-10-29 | Grand quiz Love Actually remanié (18 manches, médias) & Warm-Up simplifié sans doublon | Pack renommé « 🎄 Love Actually — Le Grand Quiz (18 manches) » (`mode = 'mixed'`), ordonné en 3 actes (facile → pointu) : 3 Blind Tests iTunes (*Jump*, *Both Sides Now* ajouté, *Bye Bye Baby*), 2 extraits YouTube (pancartes de Mark coupées avant « parfaite », emballage de Rufus), 4 choix et 1 seule bonne réponse partout, coquilles et prénoms corrigés, 2 réponses fragiles réécrites. Warm-Up : question 10 Downing Street remplacée (Sam et la batterie), images partagées avec le grand quiz retirées, leurres simplifiés. Base mise à jour **sur place** (identifiants conservés). | Adopté |
| **D31** | 2026-10-29 | Manette en texte seul, extrait Billy Mack & E2E du Grand Quiz | La Manette Joueur n'affiche plus que la question et les 4 réponses (plus d'image de question, de message vidéo, de pochette ni de préchargement d'images) ; seuls les avatars restent. Question Billy Mack réécrite en extrait vidéo. Moteur E2E mutualisé (`tests/e2e/full-game.ts`) avec contrôle des médias à chaque manche, et nouveau scénario de 18 manches `tests/e2e/grand-quiz-full-game.spec.ts`. | Adopté |
| **D32** | 2026-10-29 | AGENTS.md à jour & synchro des packs outillée | `AGENTS.md` complété (sécurité des clés, écrans/médias/anti-spoil, packs, `npm test` + `npm run test:e2e` obligatoires avant livraison). Nouveau script versionné `npm run pack:sync -- packs/<pack>.json [--set-id] [--apply]` : mise à jour sur place, simulation par défaut, refus de supprimer, vérification après écriture. | Adopté |
| **D33** | 2026-10-29 | Revue d'`AGENTS.md` à chaque décision, gardée par `npm test` | Règle n° 5 d'`AGENTS.md` : toute nouvelle `Dxx` déclenche, dans le même tour, la question « change-t-elle une règle de travail ? » et l'avancée du marqueur « Dernière revue d'AGENTS.md : Dxx ». Le test 7 de `npm test` échoue si `DECISIONS.md` contient une décision plus récente que ce marqueur. | Adopté |
| **D34** | 2026-10-29 | Photos des films pour les avatars Harry Potter & Salon masqué tant que l'univers du pack n'est pas connu | Les 18 portraits SVG générés (D29) sont remplacés par des photos promotionnelles des films, recadrées en carré sur le visage (400×400 JPEG) et hébergées dans `quiz-media/avatars/harry-potter/<id>.jpg`. Le Salon Hôte et Manette n'est plus rendu avec le thème par défaut pendant le chargement : écran neutre jusqu'à ce que le pack soit lu. `npm test` vérifie les 18 photos. | Adopté |

---

## 3. Questions Ouvertes (À trancher au fil de l'eau)

| ID | Question | Options possibles | Impact | Statut |
| :--- | :--- | :--- | :--- | :--- |
| **Q01** | Mode de réponse des joueurs en Blind Test | Tranché : Option A (QCM à 4 boutons) | Voir **D06** | Résolu |
| **Q02** | Source des extraits audio du Blind Test | Tranché : Option A (Recherche API iTunes + URL/Storage) | Voir **D07** | Résolu |
| **Q03** | Diffusion du son pendant le Blind Test | Tranché : Option A (Hôte par défaut + toggle mobile optionnel) | Voir **D08** | Résolu |
| **Q04** | Création & édition des Packs de Quiz / Blind Test | Tranché : Option A (Studio Web protégé + Import/Export JSON) | Voir **D09** | Résolu |

---

## 4. Journal Chronologique Détaillé des Arbitrages

### 2026-10-24 — D01 : Adoption de `supabase-community/kahoot-alternative` (Next.js / React)
- **Contexte** : Trois pistes étaient envisagées : (A) serveur Node.js pur calqué sur `DraftMaster`, (B) le projet officiel `supabase-community/kahoot-alternative` en Next.js / React / Supabase, ou (C) `Rahoot` en Socket.io + JSON.
- **Décision** : Retenir `supabase-community/kahoot-alternative` et accepter la stack Next.js / React.
- **Raison** : Le projet implémente déjà la mécanique complète avec Supabase Realtime (`postgres_changes`), le calcul du score à la vitesse, le QR code de salon et le découpage Écran Hôte (`/host`) / Manette Joueur (`/game/[id]`).
- **Alternatives écartées** : Refaire tout le front en Vanilla JS ou gérer un serveur Socket.io séparé (`Rahoot`).

### 2026-10-24 — D02 : Mutualisation de la base Supabase avec DraftMaster et préfixage `quiz_`
- **Contexte** : Le plan gratuit Supabase limite le nombre de projets actifs et met en pause les bases sans activité au bout de 7 jours. DraftMaster possède déjà les tables `magiciens_profiles`, `draft_records`, `admin_drafts`, `tournaments`, etc.
- **Décision** : Utiliser la même base PostgreSQL Supabase que DraftMaster et préfixer systématiquement les nouvelles tables/vues par `quiz_` (`quiz_sets`, `quiz_questions`, `quiz_choices`, `quiz_games`, `quiz_participants`, `quiz_answers`, `quiz_game_results`).
- **Raison** : Zéro collision avec DraftMaster, visibilité immédiate dans le Table Editor de Supabase, et mutualisation du trafic pour maintenir l'instance active en permanence.

### 2026-10-24 — D03 : Mise en place du système Intent-Driven & Journal de Micro-Décisions
- **Contexte** : L'auteur souhaite capitaliser les choix d'architecture et de gameplay au fur et à mesure, sans perdre le fil des arbitrages successifs.
- **Décision** : Instaurer `AGENTS.md`, `CONTEXT.md`, `DECISIONS.md` et `.specify/constitution.md` dès l'initialisation du projet. Toute modification fonctionnelle ou technique significative fait l'objet d'une entrée `Dxx` horodatée dans ce fichier.

### 2026-10-24 — D04 : Architecture de données pour le Blind Test
- **Contexte** : Le socle `kahoot-alternative` ne gère nativement que des questions texte avec une image optionnelle (`body`, `image_url`). Pour un Blind Test, l'intitulé ne doit pas dévoiler la chanson avant la fin du chrono !
- **Décision** : Enrichir `quiz_questions` avec :
  - `question_type` (`'quiz' | 'blind_test'`),
  - `audio_url` (URL du flux audio), `audio_start_sec` (début de l'extrait, défaut `0`), `audio_duration_sec` (durée d'écoute, défaut `20`),
  - `reveal_title` (titre du morceau dévoilé à la fin), `reveal_artist` (artiste dévoilé à la fin), `reveal_cover_url` (pochette dévoilée à la fin).
- **Conséquence** : Pendant le compte à rebours, l'Écran Hôte joue l'audio et affiche une animation vinyle/onde sonore ("🎵 Blind Test — Devinez le titre / l'artiste !"), puis affiche la pochette et le titre exact dès que `is_answer_revealed` passe à `true`.

### 2026-10-24 — D05 : Connexion joueur par `client_session_id` + Code PIN court
- **Contexte** : Le projet initial imposait `supabase.auth.signInAnonymously()` avec une clé étrangère stricte vers `auth.users(id)`, ce qui bloque l'entrée des joueurs si l'option Anonymous Sign-Ins n'est pas activée sur le projet Supabase de DraftMaster. De plus, l'URL du QR code était codée en dur sur `https://kahoot-alternative.vercel.app`.
- **Décision** :
  1. Remplacer la contrainte `auth.users(id)` obligatoire sur `quiz_participants` par un `client_session_id` (UUID généré côté navigateur et stocké dans `localStorage`) pour une entrée en salon 100 % sans friction.
  2. Ajouter un `pin_code` court (ex: 6 chiffres) sur `quiz_games` et utiliser `window.location.origin` dynamiquement pour le QR code afin que cela fonctionne aussi bien en local (`localhost`), sur le réseau local Wi-Fi qu'en production sur **Railway**.

### 2026-10-24 — D06 (Q01 -> A) : Mode de réponse Blind Test en QCM 4 boutons
- **Contexte** : Choisir entre QCM 4 boutons, saisie texte libre (fuzzy matching) ou mode hybride.
- **Décision** : QCM à 4 boutons colorés sur mobile, identique au mode Quiz.
- **Raison** : Ergonomie mobile à une main, rapidité de jeu en soirée, et homogénéité du calcul de score basé sur la vitesse.
- **Alternative laissée ouverte** : La colonne `text_answer` est conservée dans `quiz_answers` si l'on souhaite ajouter un mode expert en saisie libre plus tard.

### 2026-10-24 — D07 (Q02 -> A) : Recherche musicale intégrée (API iTunes) + URL / Upload MP3
- **Contexte** : Faciliter la création d'un Blind Test sans devoir découper et héberger manuellement chaque fichier MP3.
- **Décision** : Intégrer dans le Studio Hôte une barre de recherche musicale interrogeant l'API publique iTunes Search (aperçus audio AAC/MP3 de 30s gratuits, sans clé API ni restriction CORS/DRM, avec pochette HD, titre et artiste), complétée par la saisie directe d'URL audio ou l'upload vers Supabase Storage (`quiz-media`) pour les génériques ou fichiers perso.
- **Bonus ergonomique** : Lors de la sélection d'un morceau via la recherche, proposer de générer automatiquement 3 autres titres du même artiste ou du même genre comme fausses pistes (leurres) du QCM !

### 2026-10-24 — D08 (Q03 -> A) : Audio sur l'Écran Hôte par défaut + Toggle optionnel sur Mobile
- **Contexte** : Éviter l'écho désagréable sur 8 smartphones dans un salon tout en permettant de jouer à distance (Discord / visio).
- **Décision** : L'Écran Hôte (`/host/game/[id]`) lance automatiquement la lecture de l'extrait audio dès l'ouverture des choix. Sur la Manette Joueur (`/game/[id]`), le son est coupé par défaut mais un bouton discret `"🎧 Écouter sur mon téléphone"` permet au joueur d'activer le flux audio localement s'il joue à distance.

### 2026-10-24 — D09 (Q04 -> A) : Studio d'édition Web (`/host/dashboard`) + Import/Export JSON
- **Contexte** : Créer et modifier facilement ses packs de Quiz et Blind Test.
- **Décision** : Construire un Studio d'édition complet dans `/host/dashboard` (création/modification/suppression de packs et de questions, recherche musicale Blind Test, import/export JSON en 1 clic) protégé par une authentification simple via `SITE_PASSWORD` (API route Next.js `/api/host-auth`), alignée sur l'approche de DraftMaster.

### 2026-10-24 — D15 : Import du quiz Kahoot « Love actually » en pack JSON
- **Contexte** : L'auteur souhaite récupérer un quiz créé sur Kahoot (`aaedfcd7-d74d-4283-8c8d-c475882e2218`, 16 questions QCM) dans son projet.
- **Décision** : Extraire le quiz via la session Kahoot de l'auteur et le convertir au format Import/Export JSON du Studio (D09), stocké dans `packs/love-actually.json` pour être importé via « 📥 Importer JSON ». Mapping : `question` → `body`, `image` → `image_url`, `choices[].answer/correct` → `choices[].body/is_correct`, `question_type = 'quiz'`.
- **Limites acceptées** : Le temps par question Kahoot (20 à 45 s) n'a pas d'équivalent dans le schéma et est ignoré. Les images ont d'abord été liées à `media.kahoot.it`, puis copiées dans Supabase Storage (bucket public `quiz-media` créé à cette occasion, conformément à D07, chemin `packs/love-actually/qNN.ext`) pour ne plus dépendre de Kahoot.
- **Alternatives laissées ouvertes** : Ajouter une colonne de durée par question ; insertion directe via `supabase/seed.sql`.

### 2026-10-24 — D16 : Images des questions visibles sur la Manette Joueur *(Remplacée par D17)*
- **Contexte** : Le pack « Love actually » (D15) repose sur des images (« Quelle est la proposition faite à Judy à ce moment ? »). Le socle n'affichait `image_url` que sur l'Écran Hôte, la Manette Joueur restait vide au-dessus des boutons.
- **Décision** : Afficher l'illustration sur la Manette Joueur sous l'intitulé, limitée à 30 % de la hauteur d'écran pour garder les 4 boutons accessibles au pouce. Uniquement pour `question_type = 'quiz'` : en Blind Test, l'image n'est pas affichée côté joueur pour ne pas dévoiler la réponse.
- **Alternatives écartées** : Garder l'image uniquement sur l'Écran Hôte (comme Kahoot), peu pratique pour les parties à distance ou sans TV.

### 2026-10-24 — D17 : Images des questions en grand, dès l'affichage et sur la Manette Joueur
- **Contexte** : Le pack « Love actually » (D15) repose sur des images. D16 les affichait en petit sous l'intitulé de la Manette Joueur ; l'Écran Hôte ne les montrait qu'en petit (`max-h-52`) et seulement après le décompte de 5 s.
- **Décision (intention auteur)** : Image plus grande et chargée dès l'affichage de la question :
  - Écran Hôte : image visible dès la phase « Lisez bien la question » et pendant la réponse, hauteur max 50vh.
  - Manette Joueur : image dans l'espace libre entre l'intitulé et les boutons (décompte réduit à côté), sans repousser les 4 boutons hors de l'écran.
  - Préchargement de toutes les images du pack (`preloadQuestionImages`) au chargement de la partie, côté Hôte et Joueur.
  - Uniquement pour `question_type = 'quiz'` : rien côté Blind Test pour ne pas dévoiler la réponse.
- **Alternatives écartées** : Image uniquement sur l'Écran Hôte (comportement Kahoot) ; `next/image` (optimisation inutile ici, images déjà servies par Supabase Storage).

### 2026-10-24 — D19 : Extraits vidéo YouTube (colonne `video_url`, Écran Hôte uniquement)
- **Contexte** : Intention I06 — pack « Rétro 2026 » avec une question sur le clip « STORM » (GENER8ION, avec Yung Lean, réalisé par Romain Gavras) et un extrait de 20 s. Le schéma ne gérait que l'audio (`audio_url`).
- **Décision (arbitrage auteur)** :
  1. Ajouter la colonne `video_url text` à `quiz_questions` (migration `supabase/migrations/20261024170000_quiz_questions_video_url.sql`, idempotente, sans impact sur les tables DraftMaster).
  2. Réutiliser `audio_start_sec` comme début de l'extrait et `audio_duration_sec` comme durée ; cette durée reste le temps de réponse de la manche.
  3. Lecture sur l'**Écran Hôte uniquement** (cohérent avec D08), via l'iframe YouTube `autoplay` + `start` / `end`, pendant la phase de réponse. La Manette Joueur affiche « 📺 Regardez l'écran ! ».
  4. Studio : champs « Extrait vidéo YouTube », « Début (sec) » et « Durée extrait (sec) » pour les questions Quiz ; `video_url` inclus dans l'import/export JSON.
- **Alternatives écartées** : Stocker le lien YouTube dans `audio_url` (aucune migration mais mélange audio/vidéo) ; diffuser la vidéo aussi sur les téléphones.
- **Limites** : L'autoplay avec son dépend du navigateur (l'Hôte ayant cliqué « Manche suivante », il est normalement autorisé) ; une vidéo dont l'intégration est désactivée par son auteur ne pourra pas être lue.

### 2026-10-24 — D20 : Durée par défaut de 30 s et zone image / vidéo agrandie
- **Contexte** : Après le premier test du pack « Rétro 2026 », l'auteur veut un extrait STORM de 30 s à partir de 4:20, 30 s par défaut pour toutes les questions, et une zone image / vidéo environ 50 % plus grande.
- **Décision** :
  1. `DEFAULT_QUESTION_DURATION_SEC = 30` (`src/constants.ts`) utilisé partout (Studio, Écran Hôte, Manette) ; défaut SQL de `audio_duration_sec` passé à 30 (migration `20261024180000_quiz_questions_default_duration_30.sql`) ; les 20 questions existantes à 20 s passées à 30 s en base.
  2. Écran Hôte : la zone média n'est plus bridée (`max-h-52` / `max-w-5xl` / `55vh`) et occupe toute la hauteur libre ; quand la question a une image ou une vidéo, les 4 choix s'affichent sur une seule ligne pour libérer de la hauteur.
- **Limite** : Sur un écran 16:9, la vidéo est limitée par la hauteur restante (titre + choix) ; le gain réel est d'environ +25 à +50 % selon la longueur de l'intitulé.
- **Ajout de contenu** : question « Contre quel boys band Billy Mack se bat-il pour la place de numéro 1 à Noël ? » (Blue) ajoutée au pack « Love actually » (17e question, sans image pour l'instant).

### 2026-10-28 — D21 : Thèmes d'avatars exclusifs (« Love Actually » — 15 personnages) & Podium Top 3
- **Contexte** : Intention I07 — permettre aux joueurs de choisir un personnage du film *Love Actually* en guise d'avatar lorsqu'ils rejoignent une partie, avec verrouillage immédiat des avatars déjà pris par d'autres joueurs et mise en valeur sur le podium final.
- **Décision (arbitrages auteur A, A, et 15 avatars)** :
  1. **Thématisation par Pack (`quiz_sets.avatar_theme`)** : Nouvelle colonne `avatar_theme text default 'love_actually'` sur `quiz_sets` pour associer un thème d'avatars à un pack (et permettre d'autres thèmes de films/séries plus tard).
  2. **Exclusivité temps réel & SQL (`quiz_participants.avatar_id`)** : Nouvelle colonne `avatar_id text` sur `quiz_participants` protégée par un index d'unicité partiel `UNIQUE (game_id, avatar_id) WHERE avatar_id IS NOT NULL`, et exposée dans la vue `quiz_game_results`. Sur la Manette Joueur, la grille des 15 avatars écoute `quiz_participants` en temps réel (+ polling 1,5 s) et grise instantanément les personnages déjà choisis avec le badge « Pris par [Pseudo] ».
  3. **Couple Prénom + Personnage** : Le joueur clique sur son personnage et peut saisir son prénom (ex: **Titou** • *Le Premier Ministre*). S'il laisse le champ prénom vide, le nom du personnage est utilisé directement comme pseudo.
  4. **Casting des 15 personnages Love Actually** : *Le Premier Ministre (David)*, *Natalie*, *Billy Mack*, *Mark*, *Juliet*, *Jamie*, *Aurélia*, *Karen*, *Sam*, *Joanna*, *Rufus (Mr Bean)*, *Colin Frissell*, *Mia*, *John & Judy*, *Harry*.
  5. **Affichage de l'avatar & Podium fun à tous les étages** :
     - **Côté Participant (`/game/[id]`)** :
       - *Salon* : grille interactive des 15 personnages avec verrouillage live + une fois inscrit, carte héros du personnage choisi et galerie live des autres joueurs présents.
       - *Pendant chaque manche & à la révélation* : bandeau joueur permanent en haut avec son portrait *Love Actually*, son pseudo/rôle, son score cumulé et son rang actuel ; à la révélation de chaque réponse, affichage d'un **mini-podium fun Top 3** avec les avatars en tête de course.
       - *Fin de partie* : grand **Podium Top 3 (2e, 1er, 3e)** animé avec couronne, médailles et portraits + carte trophée personnelle du joueur + classement complet illustré.
     - **Côté Écran Hôte (`/host/game/[id]`)** : cartes illustrées avec avatars dans le salon et grand **Podium Top 3** sur l'écran des résultats.

### 2026-10-28 — D22 : Analyse fun de fin de partie (API Gemini gratuite + Fallback déterministe)
- **Contexte** : Intention I08 — proposer en fin de partie un débrief humoristique et bienveillant des résultats (façon cérémonie de remise de prix), exploitant le tier gratuit de l'API Gemini tout en garantissant un rendu riche même sans clé API.
- **Décision** :
  1. **Moteur statistique & Trophées déterministes** : À partir des réponses réelles (`quiz_answers`), calcul systématique des métriques par joueur (précision, série de bonnes réponses, vitesse moyenne de réponse, remontée sur les dernières manches, question la plus meurtrière) et attribution de **Trophées Spéciaux** (*⚡ Lucky Luke du Buzzer*, *🎯 Sniper Sans Pitié*, *🔥 Remontada de Noël*, *🎁 Mr Bean de l'Emballage*, *💔 Cœur Vaillant de Karen*).
  2. **Chronique IA via Gemini (`/api/game-analysis`)** : Si `GEMINI_API_KEY` (ou `GOOGLE_API_KEY`) est définie côté serveur, appel à `gemini-2.5-flash` (avec fallback `gemini-2.0-flash`) pour rédiger un commentaire de 3 à 5 phrases plein d'humour faisant des clins d'œil aux personnages *Love Actually* incarnés par les joueurs et aux faits marquants de la partie.
  3. **Fallback narratif déterministe** : Si aucune clé Gemini n'est configurée ou en cas de timeout/quota dépassé, un générateur déterministe produit instantanément une chronique personnalisée citant le podium, les avatars *Love Actually*, les trophées et la question la plus difficile.
  4. **Cache par `gameId`** : Le résultat de `/api/game-analysis` est mis en cache en mémoire serveur par `gameId` afin que l'Écran Hôte et tous les smartphones des participants affichent exactement la même chronique sans consommer plusieurs appels Gemini.

### 2026-10-28 — D23 : Pack « Love Actually — Warm-Up » (4 questions multi-formats) & Ambiance hommage au film
- **Contexte** : Intention I09 — permettre aux participants (dont de vrais fans du film) de prendre en main l'interface sur 4 manches variées et faciles avant le grand quiz, tout en plongeant toute la pièce dans l'atmosphère magique de *Love Actually*.
- **Décision** :
  1. **Pack « 🎄 Love Actually — Le Warm-Up (4 manches pour chauffer la salle) »** (`mode = 'mixed'`, stocké dans `packs/love-actually-warmup.json` et inséré directement sur Supabase) :
     - **Manche 1 (Image QCM)** : La fête de l'année autour de laquelle tourne le film (*Noël*), illustrée par Mark et sa pancarte.
     - **Manche 2 (🎵 Blind Test Musical 30 s)** : *« God Only Knows » — The Beach Boys* (la chanson mythique du final à l'aéroport d'Heathrow), avec extrait audio iTunes et révélation de la pochette.
     - **Manche 3 (🎬 Extrait Vidéo YouTube 30 s)** : Clip de *Billy Mack — « Christmas Is All Around »*, joué en vidéo sur l'Écran Hôte (« Quel mot Billy Mack remplace-t-il par "Christmas" dans sa chanson ? » → *Love*).
     - **Manche 4 (Image + Audio d'ambiance)** : Le lieu mythique qui ouvre et referme le film (*Le hall des arrivées de l'aéroport d'Heathrow*), accompagné d'une illustration et d'un fond sonore musical.
  2. **Ambiance sonore & visuelle dans le Salon et sur le Podium** :
     - Playlist d'ambiance *Love Actually* activable dans le Salon Hôte et jouée en fanfare lors de l'apparition du Podium final.
     - Affichage des répliques/descriptions cultes de chaque personnage lors de la sélection d'avatar et flocons/esthétique cinéma de Noël.

### 2026-10-28 — D24 : Isolation des réponses par partie en cours & Verrou de transition
- **Contexte** : Lors d'une partie de test, la manche 4 s'est auto-révélée prématurément ("Dommage !") sans attendre que les joueurs répondent.
- **Cause** : La requête `quiz_answers` filtrait uniquement par `question_id`. Les réponses des parties précédentes sur la même question étaient comptabilisées immédiatement.
- **Décision** : Filtrer strictement par `.in('participant_id', currentParticipantIds)` et poser des verrous `hasRevealedRef` et `isTransitioningRef`.

### 2026-10-28 — D25 : Cycle de vie stable de l'Écran Hôte (TV), synchronisation `is_answer_revealed` & Déverrouillage de la manche suivante
- **Contexte** : Alerte régression de l'auteur ("Les questions ne s'affichent plus sur la partie hôte et surtout, je ne peux plus passer à la question suivante").
- **Cause identifiée** :
  1. Dans `src/app/host/game/[id]/quiz.tsx`, le hook principal dépendait de `fetchAnswers`, qui lui-même dépendait de `participants`. Or le polling 1,5s de `HostGamePage` recréait la référence du tableau `participants` à chaque tick, provoquant le nettoyage et le redémarrage en boucle du timer de 5s (`revealTimer`) ! Ainsi, `hasShownChoices` ne passait jamais à `true`, masquant à la fois le chrono, les boutons de réponses et le bouton de saut/passage.
  2. `HostGamePage` ne transmettait pas l'état `is_answer_revealed` à `<Quiz />`, provoquant des désynchronisations en cas de remount ou de rafraîchissement F5.
  3. `quizSet.questions` n'était pas formellement trié par `order` croissant en JavaScript.
- **Décision** :
  1. Stocker `participants` dans un `useRef` pour que `fetchAnswers` et le `useEffect` principal soient totalement découplés du polling 1,5s. Le hook de manche ne dépend strictement que de `[gameId, question.id]`.
  2. Conserver `isAnswerRevealed` dans l'état de `HostGamePage` (synchronisé avec Supabase realtime + polling) et le passer en prop (`isAnswerRevealedProp`) à `<Quiz />`.
  3. Rendre le bouton « ⏭️ Révéler maintenant » accessible dès le début de la manche pour permettre à l'hôte d'abréger le décompte de lecture s'il le souhaite.
  4. Sécuriser `getNextQuestion` : calcul direct du statut terminé (`nextSeq >= questionCount`), timeout de déverrouillage de sécurité à 2,5s, et bouton « Manche suivante → » / « 🏆 Voir le Podium Final » toujours cliquable une fois la réponse révélée.

### 2026-10-28 — D26 : Écran Hôte (TV) comme diffuseur sonore unique & suppression de l'audio mobile (Zéro cacophonie)
- **Contexte** : Demande explicite de l'auteur ("il ne doit pas être possible d'écouter la musique sur l'écran de participant, ça va être la cacophonie").
- **Décision** : Remplacer la micro-décision D08 en supprimant intégralement la balise `<audio>`, l'état `mobileAudioEnabled` et le bouton « 🎧 Écouter la musique sur mon téléphone » de la Manette Joueur (`/game/[id]/quiz.tsx`).
- **Résultat** : L'Écran Hôte (TV / Enceintes de la pièce) est le diffuseur sonore unique et exclusif (Blind Test, quiz sonorisé, salon, podium). Les smartphones des joueurs restent des manettes silencieuses et réactives.

### 2026-10-28 — D27 : Synchronisation stricte Hôte ⇄ Participants du décompte de lecture & révélation des choix (Équité totale)
- **Contexte** : L'auteur signale que sur l'écran participant, les choix s'affichaient au milieu du décompte (avant qu'il arrive à 0) et avant que les choix ne s'affichent sur l'Écran Hôte (TV), brisant l'équité du jeu.
- **Cause identifiée** :
  1. Sur la Manette Joueur (`src/app/game/[id]/quiz.tsx`), un `setTimeout` bridé à `mobileRevealMs = Math.min(TIME_TIL_CHOICE_REVEAL, 2500)` coupait le décompte visuel de 5 s en plein milieu (à 2,5 s) et affichait prématurément les 4 boutons de réponse.
  2. L'Écran Hôte utilisait `TIME_TIL_CHOICE_REVEAL = 5000` (5 s) et n'avait pas de compte à rebours visuel pendant la phase de lecture. Les joueurs mobiles disposaient donc de 2,5 secondes d'avance pour lire et répondre avant même que les choix n'apparaissent sur la TV.
- **Décision** :
  1. Harmonisation stricte : Mobile et Hôte utilisent le même `TIME_TIL_CHOICE_REVEAL` (5 s) et un `CountdownCircleTimer` visuel identique (5... 4... 3... 2... 1...).
  2. Sur Mobile, les choix ne peuvent plus s'afficher avant que le décompte atteigne 0.
  3. Canal de Broadcast Realtime (`quiz_sync_${gameId}`) : L'Hôte diffuse un événement instantané `show_choices` au moment exact où la TV révèle les choix (ou si l'hôte clique « Révéler maintenant »), synchronisant tous les mobiles à la milliseconde près.
  4. Le chronomètre de score du joueur (`questionStartTime`) ne démarre qu'au moment précis où les choix deviennent visibles.

### 2026-10-28 — D28 : Test E2E « vraie soirée » du Warm-Up (1 TV + 4 manettes)
- **Contexte** : L'auteur veut un test capable de détecter de vrais bugs de soirée, côté Hôte comme côté participants, avec un contrôle du cadencement des questions et surtout de l'affichage des réponses (I10).
- **Décision** :
  1. **Playwright** pilote 5 contextes Chromium isolés : l'Écran Hôte (1920×1080, lancé depuis le Studio via « ▶ Lancer la partie ») et 4 manettes Pixel 7 (localStorage distinct = 4 vrais téléphones), contre la vraie base Supabase partagée. La partie de test est supprimée en fin de run (`E2E_KEEP_GAME=1` pour la conserver).
  2. **Scénario** : M1 tout le monde répond en < 3 s (révélation automatique) ; M2 Blind Test avec un absent (chrono complet) ; M3 vidéo avec rechargement de manette après réponse et réponse au buzzer ; M4 révélation anticipée par l'hôte et retardataire bloqué ; M5 tout le monde répond, le dernier à 26 s ; puis podium + débrief.
  3. **Cadencement contrôlé** : arrivée de chaque manche sur toutes les manettes < 3,5 s ; aucun choix visible pendant la lecture ; lecture de 5 s (±) sur chaque écran ; dérive d'apparition des choix TV/manette < 2,5 s ; révélation auto < 6 s après la dernière réponse, au chrono entre 28 et 36 s, ou à la demande de l'hôte ; révélation sur chaque manette < 2,5 s après la TV. Les mesures sont jointes au rapport (`cadencement.json`).
  4. **Affichage des réponses contrôlé** : sur la TV, bonne réponse ✅ non grisée, autres ✖ grisées, histogramme par choix = base (`data-testid="host-choice-count-N"`), Top 3 provisoire = vue `quiz_game_results` ; sur chaque manette, « Exact ! +X pts » / « Dommage ! » = score en base, score cumulé = vue, plus aucun bouton de choix après révélation.
  5. **Fin de partie** : les 4 joueurs au classement, totaux = somme des réponses, ordre du classement hôte = ordre des scores, débrief + awards affichés sur la TV et les 4 manettes, rang « #n / 4 » correct. Aucune erreur JS ni `alert()` sur les 5 écrans (les erreurs internes de l'iframe YouTube sont ignorées).
- **Alternatives écartées** : simulation par écritures directes en base (déjà couverte par `npm test`, ne voit ni les timers ni l'affichage) ; WebKit pour les manettes (non installé, Chromium mobile suffit à ce stade).

### 2026-10-28 — D29 : Thème « Harry Potter » (avatars, habillage, banquet de fin d'année) & pack de 10 manches
- **Contexte** : Intention I11 — un quiz Harry Potter difficile et fun, avec vidéos et musique, des avatars à incarner comme pour Love Actually (D21) et une analyse post-game très role play. Le thème Love Actually était codé en dur partout (grille d'avatars, textes du Salon, musiques, podium, chronique).
- **Décision** :
  1. **Habillage par univers (`src/themes.ts`)** : `getUniverseTheme(themeId)` fournit fond d'écran, textes du Salon Hôte / Manette, playlist d'ambiance, musique du Podium, libellé du mode Quiz et du débrief. Love Actually reste le thème par défaut, à l'identique.
  2. **18 sorciers exclusifs (`HARRY_POTTER_AVATARS`)** : identifiants préfixés `hp_` (évite la collision avec `harry` de Love Actually), chacun rattaché à une maison (Gryffondor ×8, Serpentard ×4, Serdaigle ×3, Poufsouffle ×2, Dobby « elfe libre »). Portraits **SVG générés** (dégradé aux couleurs de la maison + emblème) : aucune image à héberger ni à récupérer ; remplaçables plus tard par des PNG dans `quiz-media/avatars/harry-potter/`. *(Portraits remplacés par D34 : photos des films.)* Les taglines évitent de souffler les réponses du pack.
  3. **Analyse post-game role play** : pour le thème `harry_potter`, la chronique devient le **discours de Dumbledore au banquet de fin d'année** (Gemini : prompt de rôle + manchette de *La Gazette du Sorcier* façon Rita Skeeter ; `maxOutputTokens` porté à 1500 pour un discours plus long ; fallback déterministe écrit dans la même voix avec une réplique par personnage). **Coupe des Quatre Maisons** calculée à la **moyenne** des scores des membres présents (une maison nombreuse n'est pas avantagée ; Dobby ne compte pour aucune), affichée sur le podium. Trophées thématisés : *Éclair de Feu du Buzzer*, *Retourneur de Temps d'Hermione*, *Prix du Professeur Binns*, *Dix points pour Neville*, *Chaussette de Dobby*.
  4. **Résolution du thème (`resolveAvatarTheme`)** : la colonne `quiz_sets.avatar_theme` (D21) **n'existe pas encore en base** (migration non jouée). Le thème est lu dans la colonne si elle existe, sinon déduit du nom du pack (« Harry Potter », « Poudlard », « Hogwarts »), sur le même principe de repli que le préfixe `[#avatarId]` du pseudo. Le Studio transmet `avatar_theme` à l'import JSON et réessaie sans la colonne si elle est absente ; l'export JSON l'inclut.
  5. **Pack « ⚡ Harry Potter — Le Banquet des Sorciers (10 manches) »** (`packs/harry-potter.json`, inséré en base) : 3 Blind Tests iTunes (*Double Trouble* → quel film, *Lily's Theme* → quel compositeur, *O Children* → la danse sous la tente), 3 extraits YouTube officiels vérifiés intégrables (Dumbledore et la Coupe de Feu → « calmement » dans le livre, la sortie des jumeaux → 93 Chemin de Traverse, Molly contre Bellatrix → Hermione, Ginny et Luna), 4 questions pièges des livres sur fond de BO (Goutte du Mort vivant, coffre 713, Patronus de Luna, 142 escaliers). Les extraits vidéo posent une question **que l'extrait ne révèle pas** (souvent un détail du livre qui contredit ou complète le film).
- **Alternatives écartées** : images officielles des films pour les avatars (droits + hébergement) ; Coupe des Maisons à la somme des scores (avantage aux maisons nombreuses) ; réplique VF de Molly à Bellatrix comme question (formulation exacte non vérifiable).
- **Limites** : les débuts d'extraits YouTube (`audio_start_sec`) ont été calés sur les sous-titres pour la Coupe de Feu (212 s) mais à l'estime pour les jumeaux (20 s) ; à vérifier en répétition. Jouer la migration D21 rendra le thème explicite et indépendant du nom du pack.
- **Mise à jour 2026-10-28** : l'auteur a joué la migration D21. Toutes les lignes existantes de `quiz_sets` ont reçu le défaut `love_actually`, et le pack Harry Potter a été repassé explicitement à `avatar_theme = 'harry_potter'`. La colonne prime désormais sur le nom : le repli par le nom ne sert plus que si la colonne est vide. Un pack Harry Potter créé à la main dans le Studio (hors import JSON) recevra `love_actually` par défaut et devra être corrigé en base.

### 2026-10-29 — D30 : Grand quiz Love Actually remanié (18 manches, médias) & Warm-Up simplifié sans doublon
- **Contexte** : Intention I12. Le portage Kahoot (D15) était un QCM tout-image, avec deux questions à 3 choix (Pointer Sisters, mot prononcé à l'identique), de nombreuses coquilles (Juliett / Marc / Joana / Johana, « dance », « qd »…) et quelques réponses fragiles. Le Warm-Up (D23) recoupait le grand quiz (10 Downing Street + image `q06.png`, image `q13.png`, leurre « Good Vibrations »).
- **Décision (grand quiz, `packs/love-actually.json`)** :
  1. **3 actes** : chansons et scènes cultes (temps de réponse 20 s pour les questions-éclair), puis montée en puissance média, puis détails pour fans (30 s).
  2. **Blind Tests iTunes** (avec pochette révélée) : *Jump (For My Love)* (version de la BO), *Both Sides Now* de Joni Mitchell (nouvelle manche, placée juste après la question du CD de Karen pour ne rien dévoiler), *Bye Bye Baby* des Bay City Rollers (enterrement).
  3. **Extraits YouTube intégrables** (vérifiés par oEmbed et `playableInEmbed`) : pancartes de Mark (`HdFtO-1dzdU`, chaîne Universal, 30 s → 60 s, coupé avant la pancarte « To me, you are perfect » qui apparaît à 66 s) ; emballage de Rufus (`1C_hd1y8ncU`, Screen Bites, 40 s → 70 s). Timings calés sur les storyboards YouTube.
  4. **4ᵉ mauvaise réponse** : *Neutron Dance* (Pointer Sisters) et *Water* (mot qui se prononce différemment). 1 seule bonne réponse vérifiée sur les 18 questions.
  5. **Réponses réécrites après vérification** : la ville de Joanna n'est jamais citée (« She's going back to America ») → réponse « Aux États-Unis » ; la durée de l'emballage mesurée sur deux extraits (≈ 2 min 20 entre « gift-wrapped » et l'arrivée de Karen) → choix par tranches (« Entre 2 et 3 minutes »). « Jenny » corrigé en « Jeannie ». Confirmés par le script : Carol-Anne « crazy about English guys », « Table… It's the same », Harris Street (rue de Natalie, Mia est la voisine), Prince William, houx / roses / lavande utilisés.
- **Décision (Warm-Up, `packs/love-actually-warmup.json`)** : question 10 Downing Street remplacée par « Quel instrument Sam apprend-il pour impressionner Joanna ? » (batterie, sur le *Glasgow Love Theme*) ; image `q13.png` remplacée par la pochette de la BO ; leurres des deux Blind Tests remplacés par des titres évidents (*Jingle Bells*, *Wonderwall*…). Le clip de Billy Mack est conservé : il porte sur un autre fait que la question Billy Mack du grand quiz.
- **Mise en base** : mise à jour **sur place** des lignes `quiz_questions` / `quiz_choices` existantes (ordre par position, insertion de la 18ᵉ question et des 4ᵉ choix) pour conserver les identifiants et les 48 réponses historiques. Les anciennes réponses pointent désormais vers les questions réécrites : leurs scores ne changent pas.
- **Alternatives écartées** : version d'Olivia Olson de *All I Want for Christmas Is You* en Blind Test (absente d'iTunes ; la version Mariah Carey rendrait la question triviale) ; extrait vidéo du spectacle ou de la danse (dévoile la réponse) ; recréer le pack (doublon dans le Studio, historique orphelin).
- **Limites** : non vérifiés faute de source : le tatouage d'Aurelia (bas du dos) et la scène qui suit la danse de Hugh Grant (réponses Kahoot conservées). Les débuts d'extraits YouTube sont à valider en répétition.
- **Mise à jour 2026-10-29 (anti-spoil)** : signalé par l'auteur, l'avatar Juliet (tagline « Banoffee Pie », emoji 🥧) et la chronique de fin de partie dévoilaient la réponse d'une question. Remplacé par la private joke de l'auteur, « ses multiples dents » (tagline, emoji 😁, phrase de la chronique) ; l'égalité au sommet se partage désormais « la dinde de Noël ».
- **Mise à jour 2026-10-29 (anti-spoil, suite)** : à la demande de l'auteur, tout ce qui s'affiche avant ou entre les packs est neutralisé. Taglines d'avatars réécrites (Billy Mack, Mark, Karen, Sam, Joanna, Rufus) ; chronique déterministe sans Pointer Sisters, Blue, pancartes, Joni Mitchell, lavande ni cannelle ; consigne anti-spoil ajoutée au prompt Gemini (le débrief du Warm-Up passe avant le grand quiz). Salon : citation Heathrow (réponse du Warm-Up) remplacée par celle de Daniel, et playlist sans les deux Blind Tests du Warm-Up (*Glasgow Love Theme*, *Here With Me*, *Wherever You Will Go*, *White Christmas*). Le podium garde *God Only Knows* (après la partie) et Heathrow reste dans la chronique (aucune question du grand quiz).

### 2026-10-29 — D31 : Manette en texte seul, extrait Billy Mack & E2E du Grand Quiz
- **Contexte** : Intention I13. En jouant le Grand Quiz, l'auteur n'a pas eu de vidéo sur la question Billy Mack : elle était volontairement en texte seul (D30), le clip de Billy Mack servant déjà au Warm-Up. Il veut aussi des manettes au rendu garanti sur tous les téléphones et un vrai test navigateur du Grand Quiz.
- **Décision** :
  1. **Manette en texte seul** (`src/app/game/[id]/quiz.tsx`, `page.tsx`) : suppression de l'image de question (D17), du message « 📺 Regardez l'extrait » (D19), de la pochette du Blind Test à la révélation (titre et artiste restent en texte) et du préchargement des images. Les médias ne vivent plus que sur l'Écran Hôte. Les avatars (D21) restent affichés.
  2. **Question Billy Mack en extrait vidéo** : les extraits de la scène chez Ant & Dec disent « the real competition is gonna be Blue » dès les premières secondes, donc la question « contre quel boys band » serait devenue triviale. Elle devient « Comment Billy Mack termine-t-il sa phrase ? » (« Devenez pop star, on vous la donne gratuitement »), avec `EPZCstZqKj4` de 33 s à 63 s : le stylo et la photo de Blue, coupé avant le message aux enfants (vers 65–78 s, d'après les storyboards YouTube). Vidéo vérifiée intégrable.
  3. **E2E mutualisé** : le moteur de `warmup-full-game.spec.ts` passe dans `tests/e2e/full-game.ts` (`runFullGame(browser, baseURL, pack, scénario)`). À chaque manche, il vérifie en plus que la TV porte le bon média (iframe YouTube avec `start`, `end` = début + temps de réponse et `autoplay`, `<audio>` avec la bonne source, image affichée **et chargée**) et le titre révélé des Blind Tests. Il vérifie aussi que les manettes n'ont ni `iframe`, `video` ou `audio`, ni image de question ou de pochette, pendant la lecture, les choix et la révélation.
  4. **Scénario Grand Quiz (18 manches)** : réponses éclair (révélation automatique), 3 extraits vidéo joués en entier avec absents et réponse au buzzer, révélation anticipée par l'hôte avec retardataire bloqué, rechargement de manette, dernière réponse à 26 s ; puis podium et débrief. Délai du test : 25 min.
- **Limites** : le Chromium de Playwright ne lit pas l'AAC ni le H.264. Le test vérifie donc la présence et le calage des médias sur la TV, pas leur lecture effective, qui reste à contrôler en répétition sur la vraie TV. Les URL des médias sont vérifiées en HTTP par `npm test`.
- **Alternatives écartées** : garder la question « Blue » avec l'extrait (réponse donnée à l'écran) ; réutiliser le clip du Warm-Up (doublon) ; images sur la manette avec une taille adaptée à l'écran (moins fiable qu'aucune image).

### 2026-10-29 — D32 : AGENTS.md à jour & synchro des packs outillée
- **Contexte** : `AGENTS.md` n'avait pas bougé depuis l'initialisation (D03) alors que les tests, les packs, l'anti-spoil et la manette en texte seul étaient devenus des règles de fait. La mise en base des packs se faisait avec un script hors dépôt.
- **Décision** : ajouter à `AGENTS.md` les sections *Écrans, médias & anti-spoil*, *Packs de questions* et les commandes de test, avec l'obligation de faire passer `npm test` et `npm run test:e2e` avant de livrer (I13). Corriger la règle de sécurité : depuis D18, l'URL et la clé anon passent aussi au navigateur au runtime ; c'est la clé `service_role` qui ne doit jamais y aller. Versionner `scripts/sync-pack.mjs` (`npm run pack:sync`).
- **Alternatives écartées** : supprimer puis recréer les questions à chaque synchro (casse l'historique `quiz_answers`) ; synchro implicite au démarrage de l'application (écriture en base non maîtrisée).

### 2026-10-29 — D33 : Revue d'AGENTS.md à chaque décision, gardée par `npm test`
- **Contexte** : Intention I14. `AGENTS.md` était resté figé de D03 à D32 : une règle « penser à le mettre à jour » ne suffit pas, il faut un rappel qui ne dépend pas de la mémoire de l'agent.
- **Décision** : ajouter la règle n° 5 à `AGENTS.md` (mise à jour dans le même tour que la décision, règles caduques corrigées ou retirées) et un marqueur « Dernière revue d'AGENTS.md : Dxx ». Le test 7 de `npm test` compare ce marqueur au plus grand `Dxx` du registre de `DECISIONS.md` et échoue avec la marche à suivre s'il est en retard. Comme `npm test` est obligatoire avant toute livraison (D32), la revue a lieu à chaque décision.
- **Alternatives écartées** : revue périodique planifiée (décalée des changements réels) ; hook git bloquant le commit (contournable et plus lourd à maintenir) ; génération automatique d'`AGENTS.md` depuis `DECISIONS.md` (mélangerait l'historique et les règles en vigueur).

### 2026-10-29 — D34 : Photos des films pour les avatars Harry Potter & Salon sans flash d'un autre univers
- **Contexte** : Intention I15. L'auteur n'aime pas les portraits SVG générés (D29) et préfère des photos des personnages des films. En ouvrant une partie Harry Potter, il voyait au tout début les avatars Love Actually : le Salon Hôte (`quizSet` pas encore chargé) et la Manette (`themeId` encore nul) se rendaient avec le thème par défaut, musique d'ambiance Love Actually comprise côté TV.
- **Décision** :
  1. **Photos des films** : portraits promotionnels des films (récupérés sur le wiki Harry Potter Fandom), recadrés à la main sur le visage en carré 400×400 JPEG ; Fred & George partagent un portrait côte à côte. Hébergés dans le bucket public `quiz-media/avatars/harry-potter/<id>.jpg` (comme Love Actually) plutôt que liés au wiki, dont le CDN peut filtrer les requêtes. Les emblèmes de maison restent en pastille (`emoji`).
  2. **Pas de thème par défaut à l'affichage** : `HostGamePage` n'affiche le Salon qu'une fois le pack chargé, `PlayerGamePage` qu'une fois le thème résolu ; entre-temps, un écran neutre (fond uni). Le préchargement des avatars sans thème est supprimé côté Hôte.
  3. **Test** : `npm test` (test 1 bis) vérifie que les 18 sorciers ont une photo accessible en HTTP.
- **Alternatives écartées** : lien direct vers le CDN du wiki (fiabilité) ; photos des acteurs hors rôle (Wikimedia Commons) : l'auteur veut les personnages ; garder le thème par défaut avec un indicateur de chargement (montre quand même un autre univers).
- **Limites** : images sous droits des studios, utilisées pour une soirée privée. Photos d'époques différentes selon les personnages (Harry, Ron, Drago en *Reliques de la Mort* ; Lockhart en *Chambre des Secrets*…).
