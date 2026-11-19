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
| **I16** | 2026-10-30 | **15 personnages maximum par quiz** (retirer les moins populaires, mais garder Dobby) et **plus de double ascenseur** sur le choix du personnage. | Demande explicite auteur | Actif |
| **I17** | 2026-10-30 | Un quiz Harry Potter **en 8 questions, plein de private jokes** : il doit se voir que c'est l'auteur qui l'a écrit. Ton de pseudo-connaisseur très approximatif (cape du maraudeur, nain géant, rouquin malin, Dumbledore confondu avec Gandalf, jet-ski péteur de *Swiss Army Man*, Serpanthères, Poufsouf). | Demande explicite auteur | Actif |
| **I18** | 2026-10-30 | **Grand Quiz Love Actually à 15 questions** *(porté à 17 puis 20 par l'auteur, I21)* : au-delà, les joueurs se lassent. Les questions retirées sont **désactivées, pas supprimées**, pour pouvoir les remettre ou changer celles qui sont désactivées. | Demande explicite auteur | Actif |
| **I19** | 2026-10-30 | Tout le thème Harry Potter en mode **« Jean-Michel à peu près »** : vrais noms, mais descriptions très approximatives de quelqu'un qui a regardé les films de loin et aimerait aimer, sans que ça prenne. | Demande explicite auteur | Actif |
| **I20** | 2026-11-15 | Pouvoir jouer un quiz **en solo à distance** : on donne un lien (protégé par mot de passe), la personne enchaîne les questions et obtient un score **enregistré**, avec un commentaire humoristique sur **sa** performance. Les scores live sont enregistrés aussi, avec la mention **solo ou live**. Seule la **première partie solo** compte : rejouer pour améliorer son score ne doit pas être comptabilisé, une partie abandonnée non plus. Un mode **training** n'enregistre rien, et les tests E2E tournent dans ce mode. **Aucune régression** sur le quiz multi existant. | Demande explicite auteur | Actif |
| **I21** | 2026-11-15 | Le Grand Quiz Love Actually n'a rien sur **David et Natalie**, ni sur **Sarah** (la sœur de Michael) : ajouter des questions **difficiles** (depuis quand Sarah aime Karl, « elle se souvient, c'est flippant » ; le discours de David et le pied droit de Beckham) et une sur **Mia**. **Trop de Blind Tests** : en retirer un. Une **vidéo pour la scène de Mr Bean**. Le quiz passe à **17 manches**, choix de l'auteur, puis à **20** avec les trois questions proposées par l'agent (Natalie, Daniel, frère de Sarah), acceptées par l'auteur. **20 manches, pas plus** : c'est le quiz ultime qui couronne la reine de Love Actually ; les scènes cultes oubliées entrent par échange. | Demande explicite auteur | Actif |
| **I22** | 2026-11-15 | **Supprimer tous les scores de tous les quiz**, puis les **effacer automatiquement quand un quiz change** : un classement ne doit comparer que des parties jouées sur les mêmes questions. | Demande explicite auteur | Actif |
| **I23** | 2026-11-18 | Ajouter à côté du quiz *Love Actually* un **mini-jeu de soirée sur téléphone dans le navigateur**, sans lien avec des connaissances, dans l'esprit *Lapins Crétins* de la grande époque (« *un petit jeu sur téléphone dans le navigateur. Pas lié à des connaissances mais peut être un jeu de course, je ne sais pas. On mettrait un thème love actually mais un truc fun, simple dans l'esprit lapins cretins de la grande époque* »). Arbitrages complémentaires de l'auteur : (1) **un seul mini-jeu phare ultra-léché**, (2) **« 🕺 Downing Street Groove »** (danser dans les couloirs et se figer en Premier Ministre sérieux quand la porte s'ouvre), (3) **100 % Party-Game TV** (la course s'affiche sur la TV, les téléphones servent de manettes), (4) **course à la ligne d'arrivée (100 m) avec limite à 60 s** (le 1er arrivé en bas de l'escalier l'emporte), (5) **contrôles purs « Lapins Crétins »** : 2 gros boutons GAUCHE / DROITE à alterner + STOP net quand la secrétaire ouvre la porte. | Demande & arbitrage auteur | Actif |
| **I24** | 2026-11-19 | Vérifier le jeu navigateur *Love Actually* (Downing Street Groove), en améliorer la qualité si nécessaire et contrôler les effets de bord sur les quiz. Les joueurs doivent **obligatoirement** renseigner un **prénom ou pseudo**, gardé dans un **cookie** pour être **pré-rempli** quand on enchaîne sur un autre jeu. | Demande explicite auteur | Actif |
| **I25** | 2026-11-19 | Manette du Groove : « *les touches de la manette sont trop basses sur le téléphone* » ; « *un thème davantage présent* », « *un décor avec un sapin de Noël* » ; « *la musique n'est pas celle de la scène en question* ». Arbitrage : la vraie musique de la scène, en lançant le Groove **après** le Grand Quiz. | Demande & arbitrage auteur | Actif |
| **I26** | 2026-11-19 | Mieux retransmettre l'ambiance de la scène de danse (captures du couloir et de l'escalier aux portraits fournies) : « *la vieille qui apparaît quand la musique baisse pour surveiller et juger. Si on repart trop tôt à danser alors qu'on est encore en freeze et que la vieille est toujours là, sanction* ». | Demande explicite auteur | Actif |
| **I27** | 2026-11-19 | Le Groove doit tenir **jusqu'à 10 joueurs** sur l'écran : « *la hauteur de l'écran pourrait peut-être se révéler un peu juste* ». La TV est en 4K, mais l'image vient d'une **Surface Pro 7** qui streame vers elle. | Demande explicite auteur | Actif |

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
| **D32** | 2026-10-29 | AGENTS.md à jour & synchro des packs outillée | `AGENTS.md` complété (sécurité des clés, écrans/médias/anti-spoil, packs, `npm test` + `npm run test:e2e` obligatoires avant livraison). Nouveau script versionné `npm run pack:sync -- packs/<pack>.json [--set-id] [--apply]` : mise à jour sur place, simulation par défaut, refus de supprimer, vérification après écriture. | Adopté ; conservation de l'historique des réponses remplacée par **D70** |
| **D33** | 2026-10-29 | Revue d'`AGENTS.md` à chaque décision, gardée par `npm test` | Règle n° 5 d'`AGENTS.md` : toute nouvelle `Dxx` déclenche, dans le même tour, la question « change-t-elle une règle de travail ? » et l'avancée du marqueur « Dernière revue d'AGENTS.md : Dxx ». Le test 7 de `npm test` échoue si `DECISIONS.md` contient une décision plus récente que ce marqueur. | Adopté |
| **D34** | 2026-10-29 | Photos des films pour les avatars Harry Potter & Salon masqué tant que l'univers du pack n'est pas connu | Les 18 portraits SVG générés (D29) sont remplacés par des photos promotionnelles des films, recadrées en carré sur le visage (400×400 JPEG) et hébergées dans `quiz-media/avatars/harry-potter/<id>.jpg`. Le Salon Hôte et Manette n'est plus rendu avec le thème par défaut pendant le chargement : écran neutre jusqu'à ce que le pack soit lu. `npm test` vérifie les 18 photos. | Adopté |
| **D35** | 2026-10-30 | 15 personnages maximum par univers & plus d'ascenseur imbriqué sur la manette | Harry Potter passe de 18 à 15 sorciers (retrait de Mimi Geignarde, Gilderoy Lockhart et Nymphadora Tonks ; Dobby conservé). La grille du choix de personnage et le Casting du Salon Manette n'ont plus de hauteur limitée : seule la page défile. Love Actually comptait déjà 15 personnages. | Adopté |
| **D36** | 2026-10-30 | Pack Harry Potter « Vrai Connaisseur » (8 manches), créé à côté de l'ancien | Nouveau pack `packs/harry-potter-connaisseur.json` au vocabulaire volontairement faux, avec des réponses vraies une fois traduites. L'ancien pack (10 manches) reste en base et dans `packs/harry-potter.json`. `npm run pack:sync` gagne l'option `--create`. | Adopté |
| **D37** | 2026-10-30 | Grand Quiz Love Actually en 15 manches, créé à côté de l'ancien | Nouveau pack `packs/love-actually-15.json` sans le tatouage d'Aurelia, la scène après la danse et la rue de Mia. Le quiz finit sur l'extrait de l'emballage. L'ancien pack (18 manches) reste en base. Les tests ciblent le pack « (15 manches) ». | Remplacée par D38 |
| **D38** | 2026-10-30 | Questions désactivables, Grand Quiz Love Actually à 15 manches actives | Nouvelle colonne `quiz_questions.is_disabled`. Une manche désactivée reste en base, avec ses réponses historiques, mais n'est plus jouée. Pilotage par `"is_disabled": true` dans le JSON ou par l'interrupteur du Studio. Le Grand Quiz garde ses 18 lignes, dont 3 désactivées. | Adopté |
| **D39** | 2026-10-30 | Question blague Cuillandre dans Rétro 2026 | « Où est parti François Cuillandre ? » : bonne réponse Ouessant, choisie par l'auteur. C'est une blague, pas un fait vérifié. | Adopté |
| **D40** | 2026-10-30 | Question oui/non « tireuse à bièreaubeurre » dans le pack Harry Potter, en 4 boutons | Private joke sur le club de bad de l'auteur, ajoutée en 8ᵉ position (pack à 9 manches, Blind Test toujours en final). Bonne réponse supposée : Oui. Le format reste à 4 choix : Oui, Non et 2 variantes drôles. | Adopté |
| **D41** | 2026-10-30 | Textes du thème Harry Potter en ton « à peu près » | Sous-titres d'avatars, Salon, chronique, trophées et prompt Gemini réécrits avec les vrais noms et des descriptions approximatives. Mécanique (Coupe des Maisons, scores) inchangée. Love Actually non concerné. | Adopté |
| **D42** | 2026-10-30 | Question « qui n'est pas décédé en 2026 ? » dans Rétro 2026 | Jospin, Loana et Nathalie Baye (2026) contre Brigitte Bardot (28 décembre 2025), bonne réponse. | Adopté |
| **D43** | 2026-10-30 | Extrait Rosalía aux BRIT Awards dans Rétro 2026 | Vidéo `7fyufPkXLbs` (RosaliaVEVO) de 65 s à 95 s, coupée avant l'arrivée de Björk (100 s). Question : quelle invitée surprise la rejoint ? | Adopté |
| **D44** | 2026-10-30 | Question GTA 6 dans Rétro 2026 | « Comment s'appellent les deux protagonistes ? » : Lucia et Jason, contre des héros des anciens GTA (Franklin et Michael, Niko et Trevor, Tommy et CJ). | Adopté |
| **D45** | 2026-10-30 | E2E light du Grand Quiz & numérotation des manches jouées | `npm run test:e2e:light` joue un tirage aléatoire de 5 manches sur un pack temporaire. Le test complet reste obligatoire avant livraison. Écran Hôte et Manette renumérotent `order` selon la position jouée, car les manches désactivées laissaient des trous qui faisaient finir la partie trop tôt. | Adopté |
| **D46** | 2026-10-30 | Thème Rétro 2026 : 15 personnalités, habillage, chronique & extrait Shakira | Nouveau thème `retro_2026` (photos Wikimedia Commons recadrées, préfixe `r26_`), Salon et chronique propres, sans Love Actually. Question ajoutée sur l'hymne *Dai Dai* avec le live officiel FIFA `T3thHUtPdhc`, de 6 s à 36 s. *(Vidéo remplacée par D47.)* | Adopté |
| **D47** | 2026-10-30 | Rétro 2026 : images, chanson de marin & vidéo Shakira intégrable | La vidéo FIFA est bloquée hors de YouTube : remplacée par les coulisses officielles de Shakira (`dGR4XE5Fpho`, 50 s à 80 s). Images ajoutées aux 4 questions sans média, Belle-Île et *Santiano* pour Cuillandre. Nouveau test du blocage à l'intégration. | Adopté |
| **D48** | 2026-10-30 | Titre YouTube masqué sur la TV, question des décès en Mozart & Death Note, pas d'E2E pour le contenu | L'Écran Hôte zoome les vidéos de 35 % pour sortir du cadre le titre incrusté par YouTube. La question des décès passe sur le *Lacrimosa* et un cahier Death Note. Un simple ajout de contenu ne demande plus `test:e2e`. | Adopté |
| **D49** | 2026-10-30 | Extrait du Trailer 1 sur la question GTA 6 | La photo d'Ocean Drive laisse place au Trailer 1 (`QdBZY2fkU-0`), de 19 s à 49 s : Vice City et vidéos de réseaux sociaux, sans Jason ni Lucia à l'image. | Adopté |
| **D50** | 2026-10-30 | Rétro 2026 : Ophélie Meunier, Céline Dion, Monfils, Taylor Swift | Ophélie Meunier remplace Madonna dans les avatars, avec le texte choisi par l'auteur. Questions Céline Dion (*Pour que tu m'aimes encore* en fond) et Gaël Monfils. Au Salon, *Golden* reste et *DtMF* de Bad Bunny cède la place à *The Fate of Ophelia*. | Adopté |
| **D51** | 2026-10-30 | Rétro 2026 : Patrick Bruel | Patrick Bruel remplace Marine Le Pen dans les avatars. Question de l'auteur : « Quel enfoiré a dû annuler sa tournée 2026 ? », avec le Zénith de Paris à l'image, sa photo donnant la réponse. | Adopté |
| **D52** | 2026-10-30 | Rétro 2026 : Harry Kane & Lula | Harry Kane remplace Lamine Yamal et Lula remplace Nicolas Sarkozy dans les avatars et la chronique. *(Kane remplacé par D61.)* | Adopté |
| **D53** | 2026-10-30 | Rétro 2026 : Thélyson Orélien | Thélyson Orélien remplace Burna Boy dans les avatars. Question sur le titre de son roman, avec « C'était ça ou écrire » parmi les mauvais choix, à la demande de l'auteur. | Adopté |
| **D54** | 2026-10-30 | Rétro 2026 : la carte de Trump | Question sur la carte des États-Unis agrandis publiée par Trump : la Russie est la bonne réponse, Groenland, Mexique et Canada les pièges. | Adopté |
| **D55** | 2026-10-30 | Rétro 2026 : Orélien « Prompteur » | Le rôle affiché de Thélyson Orélien passe d'« Écrivain » à « Prompteur », choix de l'auteur. | Adopté |
| **D56** | 2026-10-30 | Rétro 2026 : Céline Dion | Céline Dion remplace Boualem Sansal dans les avatars et la chronique. | Adopté |
| **D57** | 2026-10-30 | Rétro 2026 : Taylor Swift & Alysa Liu | Taylor Swift remplace Donald Trump et Alysa Liu remplace Yung Lean. Questions sur les JO d'hiver et sur *The Fate of Ophelia* avec extrait du clip, retirée du Salon. | Adopté |
| **D58** | 2026-11-07 | Rétro 2026 : Jean-Luc Lahaye bientôt papa | Question « À 73 ans, quel chanteur serait bientôt papa ? », formulée au conditionnel : aucune naissance en 2026, seulement une grossesse rapportée par la presse. | Adopté |
| **D59** | 2026-11-07 | Rétro 2026 : Jean-Luc Lahaye en avatar | Jean-Luc Lahaye remplace Sébastien Lecornu dans les avatars et la chronique. | Adopté |
| **D60** | 2026-11-11 | Rétro 2026 : Jensen Huang et le kiss cam | Question photo « qui est sur ce kiss cam détourné ? » (Jensen Huang), sur sa liaison avouée avec une espionne chinoise présumée. | Adopté |
| **D61** | 2026-11-11 | Rétro 2026 : Sam Altman | Sam Altman remplace Harry Kane dans les avatars et la chronique. | Adopté |
| **D62** | 2026-11-15 | Écran Solo `/solo/[setId]` | Écran unique et autonome sur téléphone, sans Realtime : 5 s de lecture, chrono, barème 1000 → 500 identiques au live (`src/scoring.ts`, partagé avec la Manette). L'Écran Solo diffuse lui-même image, extrait YouTube (recadré, D48) et son : exception à D26/D31 propre au solo, la Manette live reste en texte seul. | Adopté |
| **D63** | 2026-11-15 | `quiz_games.play_mode` / `is_training`, tableau des scores | Deux colonnes (`live`/`solo`, défaut `live` ; `is_training`, défaut `false`), vue `quiz_game_results` inchangée. Tableau par pack `/scores/[setId]` lu directement sur `quiz_games` + participants + réponses, badge 🏠 Solo / 🎉 Live. Lien solo, solo training et scores dans le Studio. | Adopté |
| **D64** | 2026-11-15 | Mode training | Bouton « 🧪 Training » au Studio (live) et `?training=1` (solo, Studio déverrouillé seulement). La partie écrit en base pendant le jeu, n'est jamais classée, et est supprimée : à la fin en solo, par la purge des trainings de plus de 24 h à l'ouverture du Studio en live. Toute partie créée par un test est en training. | Adopté |
| **D65** | 2026-11-15 | Mot de passe solo & première partie seule comptée | `/api/solo-auth` : `SOLO_PASSWORD`, sinon le mot de passe du Studio. Une partie solo n'est classée que si c'est la toute première tentative de la personne (même appareil ou même prénom saisi) **et** qu'elle est terminée. Rejouer reste possible, sans être classé. | Adopté |
| **D66** | 2026-11-15 | Commentaire humoristique de fin de solo | `/api/solo-analysis` : Gemini, sinon texte déterministe par univers (`src/soloAnalysis.ts`), fondé uniquement sur les statistiques du joueur. Aucune question ni réponse n'est lue ; `npm test` vérifie qu'aucun texte ne contient une bonne réponse d'un pack du même univers. | Adopté |
| **D67** | 2026-11-15 | Grand Quiz Love Actually à 17 manches : Sarah, David, Mia | Deux questions ajoutées en fin de quiz (Sarah amoureuse de Karl depuis « 2 ans, 7 mois, 3 jours et 1 h 30 » ; extrait du discours de David, coupé avant la liste, « laquelle ne cite-t-il pas ? »), la rue de Mia réactivée, le Blind Test *Both Sides Now* désactivé, la question du végétal de Rufus en extrait vidéo. Pack renommé « (17 manches) », 20 lignes en base dont 3 désactivées. | Adopté |
| **D68** | 2026-11-15 | Grand Quiz Love Actually à 20 manches : Natalie, Daniel, frère de Sarah | Trois questions en texte seul ajoutées avant le final : le surnom que le père de Natalie lui donne (Plumpy), la top model citée par Daniel aux obsèques (Claudia Schiffer), le prénom du frère de Sarah (Michael). Le discours de David reste la dernière manche. Pack renommé « (20 manches) », 23 lignes en base dont 3 désactivées. | Adopté |
| **D69** | 2026-11-15 | Grand Quiz Love Actually : trois scènes cultes par échange | Entrent la promesse de Billy Mack (chanter nu), le film de Daniel et Sam (*Titanic*) et le chant de David au porte-à-porte (*Good King Wenceslas*). Sortent, désactivées : Carol-Anne, « où repart Joanna » et le prénom du frère de Sarah. Judy reste, choix de l'auteur. 20 manches actives sur 26 lignes. | Adopté |
| **D70** | 2026-11-15 | Scores effacés quand un pack change | Remise à zéro générale (46 parties, 25 participants, 122 réponses supprimés, confirmée par l'auteur). Ensuite, tout changement de jeu d'un pack (question, choix, média, calage, activation d'une manche) efface ses parties : `pack:sync --apply`, éditeur du Studio, interrupteur d'une manche. Nom et description seuls : rien n'est effacé. | Adopté |
| **D71** | 2026-11-18 | Party-Game TV « 🕺 Downing Street Groove » | Mini-jeu de course « 1, 2, 3 Soleil » façon *Lapins Crétins* (`/host/groove/[id]` sur TV, `/groove/[id]` sur manettes mobiles, moteur pur `src/groove.ts`). Session `quiz_games` marquée `current_question_sequence = -1` et `is_training = true` (zéro migration SQL, zéro impact sur les scores de quiz, redirection PIN depuis `/`), avatars exclusifs *Love Actually*, course de 100 m (60 s max) synchronisée via Supabase Broadcast (`groove_sync_${gameId}`), podium et 4 trophées dédiés. | Adopté ; musique remplacée par **D73** |
| **D72** | 2026-11-19 | Prénom obligatoire gardé en cookie & revue du Groove | Salon (quiz live et Groove) et partie solo refusent un prénom vide ; le prénom est gardé un an dans le cookie `quiz_player_name` (`src/playerName.ts`) et pré-remplit le champ du jeu suivant. Groove : décompte sans effet dans un updater React, gel daté par l'horloge de la TV, boutons au toucher (`pointerdown`), salon Groove exclu du tableau des scores même sans `is_training`, redirections croisées `/game` ↔ `/groove`, test E2E Groove réparé. | Adopté |
| **D73** | 2026-11-19 | Groove : touches remontées, décor de Noël, musique de la scène | Manette calée sur la hauteur visible (`100dvh`, zone sûre iOS) : touches au milieu de l'écran, message de flag à emplacement fixe. Décor partagé `src/components/GrooveDecor.tsx` (sapin illuminé avec cadeaux, guirlande lumineuse, neige) sur la manette, le salon TV, la piste (sapin = ligne d'arrivée des 100 m) et le podium ; lumières éteintes quand la porte s'ouvre. Musique : extrait iTunes de la scène (celui du Blind Test du Grand Quiz), Groove à lancer après le Grand Quiz (avertissement dans le Studio). | Adopté |
| **D74** | 2026-11-19 | Retouche du Groove : pas de suite E2E complète avant de livrer | Une modification limitée au mini-jeu (routes `/groove` et `/host/groove`, `src/groove.ts`, `src/components/GrooveDecor.tsx`) se livre après `npm test` et `tests/e2e/groove-game.spec.ts`. La suite complète reste due dès qu'un fichier partagé avec le quiz change (Salon, manette quiz, scores). | Adopté |
| **D75** | 2026-11-19 | Groove : la secrétaire qui juge, la fausse sortie, le décor de la scène | La musique baisse en fondu (`warning`), la secrétaire apparaît dans l'encadrement de la double porte (`watching`, musique presque coupée), puis une fois sur deux la musique repart alors qu'elle est toujours là (`lingering`, 0,9 à 1,7 s) : tout pas est alors sanctionné, sans grâce. Décor dessiné d'après la scène (`src/components/DowningStreetScene.tsx`) : murs crème, cadres dorés, double porte blanche, escalier aux portraits noir et blanc et rampe en fer forgé, parquet et tapis rouges. | Adopté |
| **D76** | 2026-11-19 | Écran TV du Groove : mis à l'échelle de l'écran, 15 couloirs sans défilement | L'écran TV est dessiné pour 1920×1080 et mis à l'échelle de la fenêtre réelle par la taille de police racine (tout ce qui est en rem suit). Pendant la course, la page tient en `100dvh` : le décor rétrécit avec le nombre de danseurs et chaque couloir tient sur une ligne, à hauteur partagée. Message de flag en surimpression, bouton plein écran au salon. Mesuré : 15 couloirs visibles de 1280×720 à 3840×2160. | Adopté |

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
  2. **18 sorciers exclusifs (`HARRY_POTTER_AVATARS`)** : identifiants préfixés `hp_` (évite la collision avec `harry` de Love Actually), chacun rattaché à une maison (Gryffondor ×8, Serpentard ×4, Serdaigle ×3, Poufsouffle ×2, Dobby « elfe libre »). Portraits **SVG générés** (dégradé aux couleurs de la maison + emblème) : aucune image à héberger ni à récupérer ; remplaçables plus tard par des PNG dans `quiz-media/avatars/harry-potter/`. *(Portraits remplacés par D34 : photos des films. Casting réduit à 15 par D35.)* Les taglines évitent de souffler les réponses du pack.
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

### 2026-10-30 — D35 : 15 personnages maximum par univers & plus d'ascenseur imbriqué sur la manette
- **Contexte** : Intention I16. Avec 18 sorciers, la grille du choix de personnage défilait dans sa propre boîte (`max-h-[340px]`) à l'intérieur d'une page qui défile déjà : deux ascenseurs côte à côte.
- **Décision** :
  1. **Casting Harry Potter réduit à 15** : retrait de Mimi Geignarde, Gilderoy Lockhart et Nymphadora Tonks, personnages secondaires les moins populaires. Dobby est conservé à la demande de l'auteur. Les 4 maisons restent représentées pour la Coupe (Gryffondor ×8, Serpentard ×4, Serdaigle ×1, Poufsouffle ×1). Leurs répliques de chronique sont retirées. `npm test` vérifie 15 sorciers, dont Dobby.
  2. **Une seule zone de défilement sur la manette** : hauteur maximale et `overflow-y-auto` retirés de la grille du choix de personnage et du Casting du Salon (même défaut, jusqu'à 15 joueurs). Seule la page défile.
- **Alternatives écartées** : retirer un Serpentard ou Neville (plus connus que Tonks) ; garder le quota de maisons équilibré (aurait obligé à garder des personnages moins populaires) ; agrandir la boîte interne (l'ascenseur revient selon l'écran).
- **Limites** : les photos des 3 personnages retirés restent dans le bucket, sans effet. Une ancienne partie où un joueur les incarnait affiche son pseudo sans avatar. Le Salon Hôte (TV) garde sa zone à hauteur limitée : un ascenseur peut y apparaître à partir de 13 joueurs.

### 2026-10-30 — D36 : Pack Harry Potter « Vrai Connaisseur » (8 manches)
- **Contexte** : Intention I17. Le Banquet des Sorciers (D29) visait de vrais fans ; l'auteur n'y connaît rien et veut que ça se voie, pour faire rire ses invités.
- **Décision** :
  1. **8 manches au ton de faux expert** : cape du maraudeur, Touffu (chien du nain géant), Dumbledore ou Gandalf (extrait vidéo de la Coupe de Feu déjà calé), Croûtard (rat du rouquin malin), jet-ski péteur de *Swiss Army Man*, blason des Serpanthères, couleurs des Poufsouf, *Lily's Theme* en Blind Test final. Les médias reprennent des extraits déjà validés (D29).
  2. **Règle de contenu adaptée** : les mots sont volontairement faux, mais chaque bonne réponse reste vraie une fois traduite (cape d'invisibilité, Hagrid demi-géant, Serpentard, Poufsouffle). La peur des araignées de Ron est écartée : la sous-titre de son avatar la dévoile.
  3. **Nouveau pack, ancien conservé** : passer de 10 à 8 questions sur place supprimerait 2 questions et leurs réponses historiques, ce que `pack:sync` refuse. Le pack est donc créé via la nouvelle option `--create`, et le choix du pack se fait dans le Studio.
- **Alternatives écartées** : réécrire les 8 premières questions et laisser 2 anciennes (ton incohérent) ; forcer la suppression (perte d'historique) ; extrait vidéo de *Swiss Army Man* (timing non vérifié, et l'extrait donnerait la réponse).
- **Limites** : faits issus de la connaissance générale de la saga, sans transcript dédié. Le Salon et la chronique gardent le ton sérieux du thème, avec les vrais noms.

### 2026-10-30 — D37 : Grand Quiz Love Actually en 15 manches (Remplacée par D38 avant mise en base)
- **Contexte** : Intention I18. 18 manches, c'est trop long pour tenir l'attention d'une soirée.
- **Décision** :
  1. **3 questions retirées** : le tatouage d'Aurelia et la scène après la danse, seules réponses non vérifiées (D30), et la rue de Mia, détail le plus pointu. Le quiz se termine sur l'extrait vidéo de l'emballage de Rufus. Les 3 Blind Tests et les 3 extraits vidéo sont conservés.
  2. **Nouveau pack, ancien conservé** (même raison que D36) : `packs/love-actually-15.json`, créé avec `--create`. Les réponses historiques restent sur le pack 18 manches.
  3. **Tests** : `npm test` et l'E2E ciblent « Le Grand Quiz (15 manches) ». La réponse tardive à 26 s passe sur la dernière manche.
- **Alternatives écartées** : retirer une question Milwaukee (leur image est déjà intégrée au rythme du 2ᵉ acte) ; supprimer les questions en base (perte d'historique).

### 2026-10-30 — D38 : Questions désactivables
- **Contexte** : Intention I18. L'auteur veut pouvoir remettre les 3 questions retirées, ou en désactiver d'autres : un pack à part (D37) figerait le choix.
- **Décision** :
  1. **Colonne `quiz_questions.is_disabled`** (migration `20261030120000_quiz_questions_is_disabled.sql`, défaut `false`). Écran Hôte, Manette et analyse filtrent les questions côté application : tant que la migration n'est pas jouée, rien ne casse et tout reste actif.
  2. **Grand Quiz** : `packs/love-actually.json` renommé « (15 manches) », `"is_disabled": true` sur le tatouage d'Aurelia, la scène après la danse et la rue de Mia. Le fichier `packs/love-actually-15.json` de D37, jamais mis en base, est retiré.
  3. **Studio** : liste des manches avec interrupteur sur chaque pack, enregistré immédiatement. Le compteur affiche les manches actives. L'export et l'import JSON gardent le champ.
  4. **Pas d'interrupteur dans l'éditeur** : son enregistrement supprime puis recrée toutes les questions, ce qui efface les réponses historiques (`handleSaveEditor`, comportement antérieur à D38, non modifié).
- **Alternatives écartées** : déplacer les questions dans un pack d'archive (pollue le Studio, logique de synchro compliquée) ; `order` négatif (astuce illisible) ; pilotage par JSON seul (l'auteur devrait repasser par un agent).
- **Limites** : changer l'activation pendant une partie décale les manches ; à faire entre deux parties. Pour le pack Harry Potter, D36 reste un pack à part.

### 2026-10-30 — D39 : Question blague Cuillandre dans Rétro 2026
- **Contexte** : l'auteur veut une question sur les municipales de Brest, avec 4 îles au choix.
- **Décision** : ajout en fin de pack, bonne réponse **Ouessant**, tranchée par l'auteur. **Fait non vérifié, assumé comme blague** : aucune source ne dit où François Cuillandre est parti (seule sa défaite face à Stéphane Roudaut est sourcée).
- **Alternatives écartées** : Kerguelen, proposée par l'agent.

### 2026-10-30 — D40 : Question oui/non « tireuse à bièreaubeurre »
- **Contexte** : l'auteur veut une question fermée sur la tireuse du club de quidisch, clin d'œil à son club de badminton qui en possède une.
- **Décision** : question en 8ᵉ position, bonne réponse **Oui** (déduite de la blague, à confirmer par l'auteur), orthographe « quidisch » conservée. Le format 4 choix (règle d'`AGENTS.md`, contrôlé par `pack:sync`) est gardé : « Oui », « Non », « Non, ça c'est le club de bad », « C'est quoi le quidisch ? ».
- **Alternatives écartées** : 2 boutons seulement (hors règle des 4 choix, affichage et tests non prévus pour).

### 2026-10-30 — D41 : Textes du thème Harry Potter en ton « à peu près »
- **Contexte** : Intention I19. Le pack était devenu approximatif, mais les avatars, le Salon et le discours de fin restaient ceux d'un connaisseur (D29).
- **Décision** : réécriture de `src/avatars.ts` (sous-titres), `src/themes.ts` et des textes Harry Potter de `src/app/api/game-analysis/route.ts`, prompt Gemini compris. Vrais noms conservés, tournures récurrentes : « je crois », « il y a un truc avec… », « ou l'inverse », « c'est expliqué dans le 2 ». Anti-spoil respecté : aucun texte ne donne Touffu, Croûtard, la confusion Dumbledore/Gandalf, le jet-ski ou la tireuse.
- **Alternatives écartées** : étendre le ton à Love Actually (non demandé).

### 2026-10-30 — D42 : Question sur les disparus de 2026
- **Contexte** : à la demande de l'auteur, qui revient sur l'exclusion proposée par l'agent : une question sur les morts de l'année, avec un intrus de 2025.
- **Décision** : ajout à `packs/retro-2026.json`. Décès en 2026 : Lionel Jospin (22 mars), Loana (25 mars), Nathalie Baye (17 avril). Intrus : Brigitte Bardot (28 décembre 2025), choisie car sa mort à quelques jours de 2026 rend le piège crédible.
- **Limites** : Jospin et Loana reposent sur Wikipédia (« 2026 en France ») ; Baye et Bardot sur plusieurs articles de presse.

### 2026-10-30 — D43 : Extrait Rosalía aux BRIT Awards
- **Contexte** : l'auteur veut le live de *Berghain* avec une question sur le featuring. La réponse ne doit pas apparaître à l'écran.
- **Décision** : vidéo `7fyufPkXLbs` (RosaliaVEVO, intégrable : oEmbed 200, `playableInEmbed: true`, 4 min 06). Extrait de 65 s à 95 s, soit 30 s. D'après les storyboards YouTube (une image toutes les 2 s), Björk apparaît en gros plan vers 100 s, et le plateau change vers 96 s. Leurres : Madonna, FKA twigs, Charli XCX.
- **Limites** : voix de Björk non contrôlée (storyboards muets) : à écouter en répétition. Le titre de la vidéo contient « ft. Björk » : vérifier sur la vraie TV qu'il ne s'affiche pas dans le lecteur.

### 2026-10-30 — D44 : Question GTA 6
- **Contexte** : l'auteur veut une question sur les protagonistes, avec les vrais noms et ceux des anciens GTA.
- **Décision** : bonne réponse Lucia et Jason (Lucia Caminos, Jason Duval). Leurres par paires, héros jouables d'anciens épisodes : Franklin et Michael (GTA V), Niko (IV) et Trevor (V), Tommy (Vice City) et CJ (San Andreas).
- **Limites** : la sortie annoncée est le 19 novembre 2026 : la question reste valable quelle que soit la date, mais ne pas formuler « sorti cette année » sans le confirmer.

### 2026-10-30 — D45 : E2E light du Grand Quiz & numérotation des manches jouées
- **Contexte** : le test complet du Grand Quiz est long, l'auteur veut une version courte, jamais sur les mêmes questions. Par ailleurs, l'E2E a révélé un bug de D38 : l'Écran Hôte calculait la manche suivante et la fin de partie avec `question.order`, or les manches désactivées laissent des trous (la manche 15 aurait été sautée).
- **Décision** :
  1. **Correctif** : `HostGamePage` et `PlayerGamePage` remplacent `order` par la position jouée après filtrage.
  2. **`npm run test:e2e:light`** (`scripts/e2e-light.mjs`, variable `E2E_LIGHT`) : 5 manches par défaut, tirage reproductible via `E2E_SEED` (affiché dans le journal), avec au moins une manche de chaque type de révélation (auto, chrono, hôte). Les manches sont copiées dans un pack temporaire « E2E light <seed> », supprimé à la fin ; un reste de test interrompu est nettoyé au lancement suivant.
  3. **Test complet inchangé** : `npm run test:e2e` joue toutes les manches actives et reste obligatoire avant livraison. Le light ne voit pas les trous de numérotation, car son pack est numéroté de 0 à n-1.
- **Alternatives écartées** : désactiver des manches au hasard dans le vrai pack (risque si une partie tourne, état à restaurer) ; paramètre de partie « questions limitées » dans l'application (code de test en production).
- **Limites** : le scénario du Grand Quiz a une entrée par manche active. Activer ou désactiver une manche demande d'ajuster `SCENARIO` dans `grand-quiz-full-game.spec.ts`, sinon le test s'arrête avec un message explicite. Un run interrompu peut laisser un pack « E2E light » visible dans le Studio jusqu'au lancement suivant.

### 2026-10-30 — D46 : Thème Rétro 2026
- **Contexte** : l'auteur veut des personnalités de 2026 comme avatars et une question sur l'hymne de la Coupe du monde avec le live de Shakira. Le pack tombait sur le thème par défaut Love Actually (Salon, avatars, chronique).
- **Décision** :
  1. **15 personnalités** validées par l'auteur : Shakira, Mbappé, Wembanyama, Trump, Lecornu, Yung Lean, Léon XIV, Cuillandre, Roudaut, Madonna, Burna Boy, Sansal, Le Pen, Sarkozy, Yamal. Photos de l'infobox Wikipédia, recadrées en carré 400×400 et hébergées dans `quiz-media/avatars/retro-2026/r26_<id>.jpg`.
  2. **Crédits photos (Wikimedia Commons)** : Junta de Andalucía CC BY-SA 2.0 (Shakira) ; Bryan Berlin CC BY-SA 4.0 (Mbappé, Yamal) ; Frenchieinportland CC BY 4.0 (Wembanyama) ; Daniel Torok, domaine public (Trump) ; Patrice Normand/Leextra CC BY-SA 4.0 (Lecornu) ; Wojciech Pędzich CC BY 4.0 (Yung Lean) ; Ricardo Stuckert CC BY-SA 4.0 (Léon XIV) ; MFonzatti CC BY-SA 4.0 (Cuillandre) ; Anne-Emmanuelle Kervella CC0 (Roudaut) ; Raph_PH CC BY 2.0 (Madonna) ; Nuță Lucian CC BY-SA 2.0 (Burna Boy) ; ActuaLitté CC BY-SA 2.0 (Sansal) ; Vox España CC0 (Le Pen) ; 首相官邸 CC BY 4.0 (Sarkozy).
  3. **Habillage et chronique** : `RETRO_2026_THEME`, `buildRetroAnalysis` et `buildRetroPrompt`. Citation du Salon non attribuée (pas de fausse citation d'une personne réelle). Le prompt Gemini interdit accusations, maladies et décès.
  4. **Anti-spoil** : sous-titres sans Metz, Espagne, Dai Dai, Ouessant, Gavras ni Björk. Playlist du Salon : *Golden*, *DtMF*. *Dai Dai* est réservée au podium, après la partie.
  5. **Question Shakira** : vidéo FIFA `T3thHUtPdhc`, intégrable (oEmbed 200, `playableInEmbed: true`), 2 min 04. Extrait de 6 s à 36 s, avant Burna Boy (vers 56 s), sans texte à l'écran d'après les storyboards. Leurres : *Waka Waka*, *Dale Dale* (inventé), *La La La*. Insérée en 4ᵉ position, après le vainqueur de la Coupe du monde.
  6. **Test** : `retro-lobby.spec.ts` vérifie le Salon et les 15 photos ; `npm test` vérifie les photos en HTTP.
- **Alternatives écartées** : extrait de la cérémonie d'ouverture (l'auteur veut la finale) ; photos générées (D34).
- **Limites** : le refrain chante le titre, c'est un indice volontairement laissé. Le titre de la vidéo FIFA ne contient pas celui de la chanson. Le test `retro-lobby` ne joue pas une partie Rétro complète, seul le Salon est couvert.

### 2026-10-30 — D47 : Rétro 2026, images, chanson de marin & vidéo Shakira intégrable
- **Contexte** : en répétition, l'auteur a vu « Vidéo non disponible » sur la question Shakira (contenu FIFA bloqué hors de YouTube) et des questions sans image. Il propose une photo de Belle-Île et une chanson de marin pour Cuillandre. `playableInEmbed: true` et oEmbed 200 ne détectaient pas le blocage.
- **Décision** :
  1. **Vidéo Shakira** : `dGR4XE5Fpho` (chaîne Shakira, coulisses du show), de 50 s à 80 s. Live de la finale d'environ 52 à 62 s, puis coulisses, d'après les storyboards. Le titre « DAI DAI » apparaît vers 24 s, avant l'extrait. Rejetées : `T3thHUtPdhc` et `Sc0EBlXORQM` (FIFA, erreur 150), `WcsYWvO5t5A` (image fixe affichant le titre).
  2. **Contrôle réel** : les 10 vidéos des packs ont été lancées dans un lecteur intégré depuis le domaine de production. Seule la vidéo FIFA était bloquée ; Rosalía et les autres passent. `tests/e2e/videos-embed.spec.ts` guette les erreurs 100, 101 et 150 sur toutes les vidéos des packs.
  3. **Images**, hébergées dans `quiz-media/packs/retro-2026/` : trophée (Djuradj Vujcic, CC BY 2.0) ; port de Sauzon à Belle-Île (Rundvald, Wikimedia Commons) ; portraits de Jospin (Parlement européen), Bardot (MGM, domaine public), Baye et Loana (Georges Biard, CC BY-SA 3.0) ; Ocean Drive à Miami pour GTA 6 (chensiyuan, CC BY-SA 4.0).
  4. **Cuillandre** : Belle-Île, volontairement absente des 4 choix, et *Santiano* de Hugues Aufray en fond (iTunes).
- **Alternatives écartées** : clip officiel `fcnDmrtj6Sk` (pas le live) ; Blind Test *Dai Dai* (l'auteur veut la finale en image).
- **Limites** : seuls 10 s environ du live sont visibles. Le blocage peut évoluer selon le pays ou l'ayant droit : le test ne vaut que pour le moment où il tourne.

### 2026-10-30 — D48 : Titre YouTube masqué, Mozart & Death Note, E2E réservé au code
- **Contexte** : en répétition, le lecteur a affiché « ROSALÍA - Berghain (Live at The BRIT Awards 2026) ft. Björk » par-dessus l'extrait, ce qui donne la réponse. L'auteur veut aussi Mozart et Death Note sur la question des décès, et ne plus repasser les E2E pour les ajouts de contenu.
- **Décision** :
  1. **Vidéo zoomée de 35 %** dans un cadre `overflow-hidden` sur l'Écran Hôte : le titre (haut) et le logo YouTube (bas) sortent du cadre, pour tous les extraits. Aucune option YouTube ne retire ce titre (`showinfo` n'existe plus).
  2. **Question des décès** : *Lacrimosa* du Requiem de Mozart (London Philharmonic, iTunes) et cahier Death Note (Keepscases, domaine public, Wikimedia Commons), à la place du collage de portraits (D47), qui reste dans le bucket.
  3. **Règle de test** : ajout de contenu d'un pack = `npm test` seul. Toute modification de code d'écran ou de jeu garde le passage E2E.
- **Limites** : le bord de l'image est perdu sur tous les extraits. Le zoom réduit la netteté sur un petit écran. Non vérifiable en capture automatique : à contrôler sur la vraie TV.

### 2026-10-30 — D49 : Extrait du Trailer 1 sur la question GTA 6
- **Contexte** : l'auteur veut un morceau de trailer de GTA 6 sur la question des protagonistes. Son message dit « dans Jason et Lucia » : compris comme « sans », puisqu'ils sont la réponse.
- **Décision** : Trailer 1 officiel de Rockstar (`QdBZY2fkU-0`), de 19 s à 49 s, en vidéo sur l'Écran Hôte, à la place de la photo d'Ocean Drive (D47), qui reste dans le bucket. Le passage a été choisi sur le storyboard de la vidéo : aucun des deux à l'image, et il commence juste après le carton « Rockstar Games presents ».
- **Alternatives écartées** : Trailer 2 (`VQRLujxTm3c`), où Jason et Lucia apparaissent dès les premières secondes et reviennent trop souvent pour tenir 30 s.
- **Limites** : le storyboard n'a qu'une image par seconde et pas de son : un plan très court ou une voix ne peuvent pas être exclus. Le passage garde les plans dénudés du trailer. À contrôler sur la vraie TV.

### 2026-10-30 — D50 : Ophélie Meunier, Céline Dion, Monfils & Taylor Swift
- **Contexte** : l'auteur veut Ophélie Meunier à la place de Madonna, des questions sur Céline Dion et sur « le retraité » Gaël Monfils. Il aime *Golden* au Salon, pas Bad Bunny.
- **Décision** :
  1. **Avatar** : `r26_ophelie` remplace `r26_madonna`, avec le texte voulu par l'auteur, « Askip elle est du fion », exception assumée à la règle des sous-titres neutres. Photo : Georges Biard, César 2016 (CC BY-SA 3.0).
  2. **Céline Dion** : retour annoncé le 30 mars 2026 à Paris La Défense Arena (celinedion.com, Paris Match). La question porte sur la ville, car je n'ai pas trouvé de compte rendu des concerts. Fond : *Pour que tu m'aimes encore* (iTunes). Photo : Georges Biard, 2012 (CC BY-SA 3.0).
  3. **Monfils** : retraite annoncée le 1er octobre 2025 pour la fin de saison 2026 ; dernier match officiel à l'US Open selon Sud Radio. La question porte sur son mariage avec Elina Svitolina, car les sources divergent sur le dernier match. Photo : si.robi, Roland-Garros 2019 (CC BY-SA 2.0).
  4. **Salon** : *Golden* reste, *The Fate of Ophelia* de Taylor Swift remplace *DtMF*. Ce choix de titre est le mien. Remplacée par D57 pour *The Fate of Ophelia*.
- **Limites** : Madonna reste un mauvais choix de la question Rosalía. La photo `r26_madonna` reste dans le bucket.

### 2026-10-30 — D51 : Patrick Bruel
- **Contexte** : l'auteur veut Patrick Bruel à la place de Marine Le Pen, et fixe la question : « Quel enfoiré a dû annuler sa tournée 2026 ? », jeu de mots avec Les Enfoirés.
- **Décision** :
  1. **Fait vérifié** : annulation des 35 dates de la tournée d'automne, annoncée le 1er septembre 2026 (Paris Match, Sud Radio/AFP). Mauvais choix : Soprano, Patrick Fiori, Michaël Youn.
  2. **Image** : Zénith de Paris (Flickr, CC BY 2.0), car une photo de Bruel donnerait la réponse.
  3. **Avatar** : `r26_bruel`, sous-titre neutre sur le poker, sans allusion à l'affaire, conformément à la règle des sous-titres. Photo : Georges Biard, Dîner des César 2018 (CC BY-SA 4.0).
- **Limites** : l'annulation intervient alors que Patrick Bruel est mis en examen pour violences sexuelles, ce qu'il conteste. Le mot « enfoiré » est le choix de l'auteur, pour une soirée privée ; la présomption d'innocence s'applique et rien dans le jeu ne détaille l'affaire.

### 2026-10-30 — D52 : Harry Kane & Lula
- **Contexte** : l'auteur veut Harry Kane à la place de Yamal et Lula à la place de Sarkozy.
- **Décision** :
  1. **Avatars** : `r26_kane` remplace `r26_yamal`, `r26_lula` remplace `r26_sarkozy`, aux mêmes places, avec leurs phrases de chronique.
  2. **Photos** : infobox Wikipédia, recadrées en carré 400×400. Kane : Bryan Berlin, Angleterre-Ghana du 23 juin 2026 (CC BY-SA 4.0). Lula : Palácio do Planalto, photo officielle de 2023 (CC BY 2.0).
  3. **Sous-titres** : rien sur la Coupe du monde ni sur l'élection présidentielle brésilienne d'octobre 2026, non vérifiée ici. « Président du Brésil » reste exact jusqu'à la fin du mandat, début 2027.
- **Limites** : le Brésil reste un mauvais choix de la question sur la Coupe du monde, Lula ne donne donc pas la réponse. Les photos `r26_yamal` et `r26_sarkozy` restent dans le bucket. Les crédits de D46 restent valables pour l'historique.

### 2026-10-30 — D53 : Thélyson Orélien
- **Contexte** : l'auteur veut Thélyson Orélien à la place de Burna Boy et une question sur le titre de son roman, avec « C'était ça ou écrire » dans les suggestions.
- **Décision** :
  1. **Fait vérifié** : le vrai titre est *C'était ça ou mourir* (Boréal, mars 2026 ; Grasset, août 2026), retiré de la 1ʳᵉ sélection du Goncourt fin septembre (Wikipédia, Livres Hebdo, ActuaLitté). « C'était ça ou écrire » n'existe pas : c'est donc un mauvais choix. Autres leurres inventés : « C'était ça ou partir », « C'était ça ou rien ».
  2. **Question** : 12ᵉ et dernière du pack, formulée sur le retrait du Goncourt, un fait établi, sans affirmer l'usage de l'IA, que l'écrivain conteste pour la rédaction.
  3. **Avatar** : `r26_orelien`, sous-titre neutre sans le titre du roman (zéro spoil). Photo : Jean Laposte, Wikimedia Commons (CC BY-SA 3.0), aussi utilisée comme image de la question.
- **Alternatives écartées** : couverture du livre, qui donnerait la réponse ; `Haitian author and poet Thélyson Orélien.jpg`, plus grande, mais trop serrée et avec une autre personne dans le cadre.
- **Limites** : la photo source fait 160×240, elle est floue en 400×400, surtout en grand sur la TV. La photo `r26_burnaboy` reste dans le bucket. L'affaire évolue encore : à revérifier avant la soirée.

### 2026-10-30 — D54 : La carte de Trump
- **Contexte** : l'auteur veut une question « quel pays n'a pas été menacé par Trump », avec la Russie en bonne réponse et Groenland, Mexique, Canada en pièges.
- **Décision** :
  1. **Formulation changée** : Trump a bien menacé la Russie (sanctions et droits de douane, ultimatums de 2025), « menacé » rendrait la réponse fausse. La question porte sur la carte publiée début septembre 2026, qui montre le Canada, le Mexique et le Groenland comme américains (Daily Signal, APA).
  2. **Choix** : La Russie (bonne réponse), Le Groenland, Le Mexique, Le Canada. « Territoires » plutôt que « pays », le Groenland n'étant pas un État.
  3. **Image** : portrait de Trump déjà hébergé (`r26_trump`), car la carte elle-même donnerait la réponse.
- **Limites** : je n'ai pas vu la carte, l'article du Daily Signal étant inaccessible : l'absence de la Russie repose sur les listes des comptes rendus. 13ᵉ et dernière question du pack.

### 2026-10-30 — D55 : Orélien « Prompteur »
- **Contexte** : l'auteur veut « Prompteur » à la place d'« Écrivain » sur l'avatar de Thélyson Orélien (précise D53).
- **Décision** : rôle affiché `Prompteur`. Exception assumée à la règle des sous-titres sans accusation, comme en D50, pour une soirée privée.
- **Limites** : le mot sous-entend l'usage de l'IA pour la rédaction, que l'écrivain conteste. La question du pack reste formulée sur le retrait du Goncourt.

### 2026-10-30 — D56 : Céline Dion
- **Contexte** : l'auteur veut Céline Dion en avatar à la place de Boualem Sansal.
- **Décision** : `r26_celine` remplace `r26_sansal`, à la même place, avec sa phrase de chronique. Photo : celle de la question (D50, Georges Biard, 2012, CC BY-SA 3.0), recadrée en 400×400. Sous-titre sans la ville de son retour, réponse d'une question du pack.
- **Limites** : la même photo apparaît à la fois sur l'avatar et sur la question. La photo `r26_sansal` reste dans le bucket.

### 2026-10-30 — D57 : Taylor Swift, Alysa Liu, JO d'hiver & clip
- **Contexte** : l'auteur veut Taylor Swift à la place de Trump et Alysa Liu à la place de Yung Lean, une question sur les JO d'hiver et une sur le titre de Taylor Swift avec un extrait du clip s'il n'est pas bloqué.
- **Décision** :
  1. **Avatars** : `r26_taylor` et `r26_alysa`, aux mêmes places, avec leurs phrases de chronique. Photos : iHeartRadioCA, MTV VMA 2023 (CC BY 3.0) ; YantsImages, Milan-Cortina 2026 (CC BY-SA 4.0). Le portrait `r26_trump` reste dans le bucket : c'est l'image de la question de la carte (D54).
  2. **JO** : la question porte sur les 23 médailles françaises, record, 6ᵉ au classement des nations (ministère des Sports). Une question sur l'or d'Alysa Liu serait donnée par son avatar. Image : Cortina d'Ampezzo (kallerna, CC BY-SA 4.0). Leurres : 15, 19, 31.
  3. **Clip** : vidéo officielle `ko70cExuzZM`, de 18 s à 48 s, choisie sur le storyboard : elle commence après le tableau d'Ophélie (10 à 16 s), qui donnerait le titre. Leurres : *The Life of a Showgirl*, *Opalite*, *Elizabeth Taylor*, titres du même album.
  4. **Salon** : *The Fate of Ophelia* donnerait la réponse (D50 remplacée sur ce point) : *Man I Need* d'Olivia Dean (iTunes) prend sa place. Ce choix de titre est le mien.
- **Limites** : le clip date d'octobre 2025. YouTube ne fournit pas de sous-titres pour ce clip et le storyboard n'a pas de son : je n'ai pas pu vérifier que le titre n'est pas chanté avant 48 s. À écouter sur la vraie TV. Le test d'intégration a tourné depuis localhost, pas depuis le domaine de production. La photo `r26_yunglean` reste dans le bucket.

### 2026-11-07 — D58 : Jean-Luc Lahaye bientôt papa
- **Contexte** : l'auteur veut la question « Qui a eu un enfant en 2026 ? », avec Jean-Luc Lahaie en bonne réponse.
- **Décision** :
  1. **Fait vérifié** : aucune naissance en 2026. *France Dimanche* (6 novembre 2026, repris par MRadio et Le Tribunal du Net) rapporte que Paola, épouse du chanteur depuis juillet, serait enceinte de quatre mois, sans annonce officielle du couple. La naissance annoncée en septembre 2025 était celle de son petit-enfant (fille Gloria). Orthographe : Lahaye.
  2. **Question** : 16ᵉ du pack, reformulée avec l'accord de l'auteur : « 👶 À 73 ans, quel chanteur serait bientôt papa ? ». Le conditionnel suit celui de la presse.
  3. **Leurres** : Michel Sardou, Hervé Vilard, Jean-Jacques Goldman, chanteurs vivants sans bébé annoncé. Herbert Léonard, envisagé, est mort en 2025.
  4. **Image** : aucune, une photo du chanteur donnerait la réponse.
- **Limites** : la grossesse n'est pas confirmée par le couple, à revérifier avant la soirée. Le chanteur est mis en examen pour viols et agressions sexuelles sur mineures, ce que la question n'évoque pas.

### 2026-11-07 — D59 : Jean-Luc Lahaye en avatar
- **Contexte** : l'auteur veut Jean-Luc Lahaye à la place de Sébastien Lecornu dans les avatars.
- **Décision** :
  1. **Avatar** : `r26_lahaye` remplace `r26_lecornu`, à la même place, avec sa phrase de chronique. Sous-titre neutre sur les années 80, sans allusion à la paternité (réponse de la question D58) ni à l'affaire judiciaire, conformément à la règle des sous-titres.
  2. **Photo** : Georges Biard, concert « La Folie des années 80 » à Enghien-les-Bains, 8 juin 2013 (CC BY-SA 3.0), recadrée en carré 400×400.
- **Alternatives écartées** : `JL-Lahaye.jpg` (photo de l'infobox, 2010), plus ancienne ; `Jean-Luc Lahaye 2023.jpg`, en pied et très étroite.
- **Limites** : comme pour Bruel, Céline Dion ou Orélien, voir le chanteur parmi les avatars peut orienter la question D58. La photo `r26_lecornu` reste dans le bucket. Les crédits de D46 restent valables pour l'historique.

### 2026-11-11 — D60 : Jensen Huang et le kiss cam
- **Contexte** : l'auteur veut une question sur la liaison de Jensen Huang avec une espionne chinoise, avec une photo « marrante » fournie dans `raw/jensen.png`, en demandant qui est sur la photo.
- **Décision** :
  1. **Fait vérifié** : Jensen Huang a avoué le 8 novembre 2026, dans un message aux salariés de Nvidia, une liaison avec Alice Huang, femme d'affaires chinoise (Megaspeed). Qu'elle soit une espionne du ministère chinois de la Sécurité d'État reste une **accusation** (New York Times, NBC, CNN, sources anonymes), démentie par Pékin. D'où « espionne chinoise présumée ».
  2. **Photo** : c'est un **montage**, un mème qui détourne le kiss cam du concert de Coldplay (juillet 2025). La femme n'est pas Alice Huang. La question dit donc « kiss cam détourné » et ne nomme personne d'autre. Convertie en JPEG, hébergée dans `quiz-media/packs/retro-2026/jensen.jpg`. Le fichier source reste dans `raw/`, non commité.
  3. **Question** : 17ᵉ du pack, « 💋 Liaison avouée avec une espionne chinoise présumée : qui est sur ce kiss cam détourné ? ». Leurres : Tim Cook, Satya Nadella, Sundar Pichai, patrons de la tech.
- **Alternatives écartées** : Andy Byron, l'ex-PDG du vrai kiss cam de Coldplay : le montage reprend sans doute son corps, ce qui ferait deux réponses défendables.
- **Limites** : l'origine et l'auteur du montage sont inconnus, usage limité à une soirée privée. L'enquête de Nvidia est en cours : à revérifier avant la soirée.

### 2026-11-11 — D61 : Sam Altman
- **Contexte** : l'auteur veut Sam Altman à la place de Harry Kane dans les avatars (précise D52).
- **Décision** : `r26_altman` remplace `r26_kane`, à la même place, avec sa phrase de chronique. Sous-titre sur les promesses d'IA générale, sans accusation. Photo : Bureau du Premier ministre du Japon, 3 février 2025 (CC BY 4.0), photo de l'infobox Wikipédia recadrée en carré 400×400.
- **Limites** : la photo `r26_kane` reste dans le bucket. Sam Altman n'est ni la réponse ni un leurre d'aucune question.

### 2026-11-15 — D62 : Écran Solo
- **Contexte** : intention I20. L'auteur veut envoyer un lien pour qu'une personne joue seule, chez elle, sans TV ni hôte.
- **Décision** :
  1. **Route `/solo/[setId]`**, écran unique sur téléphone, sans Realtime ni polling : intro (personnage du thème, prénom facultatif), manches, résultat. Pas de verrou d'avatar : une seule personne joue.
  2. **Même cadencement et même barème que le live** pour que les scores soient comparables : 5 s de lecture sans aucun choix affiché, chrono = `audio_duration_sec`, 1000 → 500 points. Le calcul est extrait dans `src/scoring.ts` et utilisé tel quel par la Manette live (seule modification de la Manette).
  3. **L'Écran Solo diffuse les médias** : image dès la lecture, extrait YouTube (zoom de D48 conservé) et son pendant la réponse, pochette et titre du Blind Test à la révélation. Exception à D26 et D31 limitée au solo. Un unique élément `<audio>` est débloqué au clic « Commencer » pour que le son passe sur mobile ; si le navigateur refuse, un bouton « ▶️ Lancer le son » apparaît.
  4. Réponse donnée : révélation immédiate avec la bonne réponse. Chrono écoulé : « Temps écoulé ! », aucune ligne `quiz_answers`, comme en live.
  5. Les écrans live (Hôte, Manette, Salon) ne sont pas refactorés (I20 : aucune régression).
- **Alternatives écartées** : jouer le solo avec l'Écran Hôte et la Manette existants dans deux onglets, inutilisable sur un seul téléphone ; refactor commun Hôte / Manette / Solo, trop risqué pour les soirées.
- **Limites** : la lecture du son et de la vidéo YouTube sur iPhone et Android n'est pas vérifiable par Playwright (Chromium sans AAC ni H.264) : à contrôler sur de vrais téléphones. Si la vidéo ne démarre pas seule, le joueur la touche ; le chrono tourne quand même. Un rechargement en pleine partie ramène à l'intro.

### 2026-11-15 — D63 : `play_mode`, `is_training` et tableau des scores
- **Contexte** : les scores live doivent être enregistrés aussi, avec la mention solo ou live.
- **Décision** :
  1. Migration `20261115120000_quiz_games_play_mode.sql` (idempotente, `quiz_games` seulement) : `play_mode text default 'live'` contraint à `live`/`solo`, `is_training boolean default false`. Le lancement live normal n'écrit aucune nouvelle colonne : il fonctionne même sans la migration.
  2. Une partie solo est une vraie ligne `quiz_games` (+ 1 participant + ses réponses), sans nouvelle table. La recherche par PIN de l'accueil ignore les parties solo.
  3. **Tableau des scores** (`src/leaderboard.ts`, `src/components/PackLeaderboard.tsx`, page `/scores/[setId]`) lu sur `quiz_games` avec participants et réponses imbriqués, hors training. Live : chaque joueur d'une partie terminée. Solo : règle de D65. Chaque ligne porte le mode, la date et le personnage. La vue `quiz_game_results` n'est pas modifiée.
  4. Studio : liens « 🏆 Scores », « 🧪 Solo training » et « 🔗 Lien solo » (copie) sur chaque pack.
- **Alternatives écartées** : table `quiz_scores` dédiée (doublon de `quiz_answers`) ; étendre la vue (ordre des colonnes figé par `create or replace view`).
- **Limites** : « 🔄 Rejouer ce Pack » sur le podium Hôte efface les réponses de la session, donc les scores de cette soirée. L'éditeur du Studio supprime et recrée les questions à l'enregistrement (D38) et efface ainsi les scores du pack : passer par `npm run pack:sync`. Un pack qui évolue rend les scores de dates différentes peu comparables, d'où la date affichée.

### 2026-11-15 — D64 : Mode training
- **Contexte** : l'auteur veut pouvoir jouer sans enregistrer, et que les E2E ne polluent pas les scores.
- **Décision** :
  1. Live : bouton « 🧪 Training » à côté de « ▶ Lancer la partie » (libellé inchangé). Bandeau « 🧪 Training — scores non enregistrés » sur l'Écran Hôte. Solo : `?training=1`, accepté seulement si le Studio est déverrouillé dans ce navigateur, pour qu'un joueur ne puisse pas découvrir les questions avant sa vraie partie.
  2. Une partie training écrit en base pendant le jeu (le live en a besoin pour synchroniser les écrans, et les E2E confrontent les écrans à la base), mais n'est jamais classée. En solo, elle est supprimée à la fin, après le commentaire ; les trainings de plus de 24 h sont purgés à l'ouverture du Studio.
  3. Les E2E live lancent par « 🧪 Training » et vérifient `is_training` en base ; `npm test` et `retro-lobby` créent leurs parties en training ; le scénario solo joue en training, sauf la vérification de la règle de D65, jouée sur un pack temporaire supprimé à la fin.
- **Alternative écartée** : un training sans aucune écriture, incompatible avec la synchronisation live et avec les E2E.

### 2026-11-15 — D65 : Mot de passe solo et première partie seule comptée
- **Contexte** : arbitrages de l'auteur : un mot de passe pour que des inconnus ne jouent pas ; empêcher de refaire le quiz en solo pour améliorer son score (on peut le refaire, ce n'est pas comptabilisé) ; une partie commencée et non finie n'est pas comptabilisée. Les joueurs joueront soit en live, soit en solo.
- **Décision** :
  1. `/api/solo-auth` compare à `SOLO_PASSWORD`, sinon à `SITE_PASSWORD` (le mot de passe du Studio), sinon au défaut du Studio. L'écran de saisie (`src/components/SoloGate.tsx`) protège `/solo` et `/scores` ; le déverrouillage est mémorisé sur l'appareil, et un Studio déverrouillé passe directement.
  2. Une personne = un appareil (`client_session_id`) **ou** un prénom saisi (normalisé : casse, accents, espaces). Seule sa toute première partie solo non training est classée, et seulement si elle est terminée : une première partie abandonnée bloque aussi les suivantes, sinon abandonner permettrait de voir les questions avant de rejouer.
  3. À l'ouverture du lien, l'intro prévient si l'appareil a déjà tenté le quiz. À la fin, le joueur voit « Score enregistré » ou « Partie rejouée : ce score n'est pas classé ». Les parties non classées sont listées dans une section repliée, visible seulement Studio déverrouillé.
  4. Pas de rapprochement entre live et solo, puisqu'une personne joue l'un ou l'autre.
- **Alternatives écartées** : reprise d'une partie interrompue, signaux de triche (sorties d'onglet, vitesse), codes d'invitation personnels : plus que ce que l'auteur demande.
- **Limites** : sans le mot de passe dédié `SOLO_PASSWORD`, les joueurs reçoivent le mot de passe du Studio et peuvent donc y entrer. Le mot de passe est un verrou d'écran : les données restent lisibles avec la clé anon. Un joueur qui vide son navigateur **et** change de prénom (ou garde le nom du personnage) peut rejouer en étant classé ; deux personnes différentes qui saisissent le même prénom ne sont classées qu'une fois.

### 2026-11-15 — D66 : Commentaire humoristique de fin de solo
- **Contexte** : arbitrage de l'auteur : un commentaire humoristique en fin de solo, forcément fondé sur la performance individuelle.
- **Décision** :
  1. `/api/solo-analysis` (`POST { gameId }`) calcule les statistiques du joueur (`src/soloAnalysis.ts`) : bonnes et mauvaises réponses, manches laissées au chrono, plus longue série, part du chrono utilisée sur les bonnes réponses (déduite du score), première moitié contre seconde, meilleure manche. Aucune comparaison avec d'autres joueurs.
  2. Gemini si une clé existe (prompt par univers, sans aucune question ni réponse), sinon texte déterministe par univers : Love Actually, Harry Potter « à peu près » (D41), Rétro 2026 (le joueur est taquiné, jamais la personnalité qu'il incarne), et une voix neutre pour un univers sans texte dédié. Cache par partie.
  3. `npm test` (test 9) génère les textes de chaque univers sur plusieurs profils et vérifie qu'aucun ne contient une bonne réponse, un titre ou un artiste d'un pack du même univers. Ce test a fait retirer des premiers jets des allusions à des réponses (un serpent, le Chemin de Traverse, la cape, l'aéroport, le CD de Karen).
  4. `/api/game-analysis` n'est pas modifié ; l'appel Gemini est dupliqué plutôt que partagé, pour ne pas toucher au débrief live.
- **Limites** : le texte produit par Gemini n'est pas contrôlé par le test ; seul son prompt l'est. Le prompt interdit de citer lieux, objets, chansons et personnages autres que celui incarné.

### 2026-11-15 — D67 : Grand Quiz Love Actually à 17 manches (Sarah, David, Mia)
- **Contexte** : Intention I21. Aucune question ne portait sur David et Natalie ni sur Sarah ; l'auteur trouve les Blind Tests trop nombreux et veut une vidéo sur la scène de Rufus. Interrogé, il choisit 17 manches plutôt que de rester à 15 (I18).
- **Décision** :
  1. **Sarah** (texte seul, 30 s) : la question rappelle qu'elle travaille pour Harry depuis « 2 ans, 7 mois, 3 jours et 2 heures » et demande depuis quand elle aime Karl : « 2 ans, 7 mois, 3 jours et 1 h 30 ». Les leurres sont à une unité près.
  2. **David** (extrait `pBmo_xlPILU`, chaîne RomComs, 95 s → 125 s) : la conférence de presse jusqu'à « …that really matter to Britain », coupée avant la liste, qui commence après 127 s (transcription YouTube). Question « laquelle ne cite-t-il PAS ? » : les Rolling Stones, contre Harry Potter, Sean Connery et le pied gauche de David Beckham, tous cités.
  3. **Mia** : la question désactivée « Dans quelle rue habite Mia ? » (Harris Street, vérifiée en D30) est réactivée. Ses cornes de diable sont exclues : la sous-titre de son avatar et la chronique les dévoilent.
  4. **Blind Test retiré** : *Both Sides Now* est désactivé, il suivait la question du CD de Joni Mitchell. Restent *Jump* et *Bye Bye Baby*.
  5. **Rufus en vidéo** : la question du végétal passe de l'image `q07.png` à l'extrait `1C_hd1y8ncU` de 40 s à 70 s (sachet, puis tiroir de boutons de rose vers 64 s). La question de la durée, qui suit, passe de 40 s → 70 s à 72 s → 102 s (lavande, bâton de cannelle) pour ne pas rejouer le même passage. Le houx n'apparaît qu'à 130 s. Calage sur les planches d'aperçu YouTube.
  6. **Ordre et base** : les deux nouvelles questions sont ajoutées en fin de pack (positions 18 et 19) : `pack:sync` associe les lignes par position, une insertion au milieu aurait décalé les 49 réponses historiques vers d'autres questions. Le quiz se termine donc sur Mia, Sarah puis le discours de David. Pack renommé « (17 manches) », synchronisé avec `--set-id`.
  7. **Tests** : `npm test` attend 17 manches actives sur 20, au moins 2 Blind Tests et 5 extraits vidéo ; le scénario E2E du Grand Quiz passe à 17 manches.
- **Alternatives écartées** : rester à 15 en désactivant « Carol-Anne » et le végétal (proposé, non retenu par l'auteur) ; question « que cite-t-il après le pied droit de Beckham ? » (réponse trop devinable) ; extrait vidéo de la scène Sarah et Harry (la première durée y est dite, la seconde suit aussitôt) ; nouvelle question sur Mia.
- **Limites** : répliques vérifiées sur la version originale ; à contrôler si la VF arrondit différemment la durée de Sarah. L'extrait de 40 s → 70 s montre les roses, ce qui écarte un leurre de la question du végétal. Débuts d'extraits à valider en répétition sur la vraie TV.

### 2026-11-15 — D68 : Grand Quiz Love Actually à 20 manches (Natalie, Daniel, frère de Sarah)
- **Contexte** : Intention I21. L'auteur a demandé 2 ou 3 idées de questions en plus ; il accepte les trois proposées.
- **Décision** :
  1. **Natalie** : « Quel surnom le père de Natalie donne-t-il à sa fille ? » : Plumpy, contre Chubby, Piggy et Dumpling.
  2. **Daniel** : la top model au bras de laquelle sa femme voulait le voir arriver à ses obsèques : Claudia Schiffer, contre Cindy Crawford, Naomi Campbell et Kate Moss.
  3. **Frère de Sarah** : Michael, contre Peter, Tony et Jamie, prénoms d'autres personnages du film.
  4. **Ordre** : positions 19 à 21, en texte seul, 30 s. L'extrait du discours de David passe en position 22 et reste le final. Les lignes 18 et 19 dataient de D67, sans réponse historique : les déplacer ne décale rien. La question de Sarah et Karl et celle de son frère sont séparées par deux manches.
  5. **Tests** : `npm test` attend 20 manches actives sur 23 ; le scénario E2E passe à 20 manches.
- **Alternatives écartées** : la rue de Natalie (même réponse que la rue de Mia) ; ajouter les questions après le discours de David (le quiz finirait sur du texte seul).
- **Limites** : faits recoupés sur des pages de fans et de quiz, pas sur le script. « Plumpy » est le surnom de la version originale : la VF peut en employer un autre, à vérifier par l'auteur avant la soirée. Aucune de ces réponses n'apparaît dans les avatars, le Salon ni les chroniques.

### 2026-11-15 — D69 : Grand Quiz Love Actually, trois scènes cultes par échange
- **Contexte** : Intention I21. L'auteur demande les scènes ou répliques cultes oubliées et fixe le plafond à 20 manches. Il accepte les échanges proposés, sauf la sortie de Judy.
- **Décision** :
  1. **Entrent** (texte seul, 30 s) : « Que promet Billy Mack de faire à la télévision s'il est numéro 1 ? » (chanter entièrement nu) ; « Quel film Daniel et Sam regardent-ils sur le canapé ? » (*Titanic*) ; « Quel chant de Noël David doit-il chanter en cherchant Natalie ? » (*Good King Wenceslas*).
  2. **Sortent**, désactivées et récupérables dans le Studio : Carol-Anne (Milwaukee garde la question de l'accent), « Où repart Joanna » et le prénom du frère de Sarah (ajouté en D68).
  3. **Judy reste** : avec trois sorties pour quatre entrées possibles, la quatrième idée n'entre pas, pour tenir les 20 manches.
  4. **Homard de la Nativité écarté** : la sous-titre de l'avatar de Karen (« costume de homard ») et la chronique de fin de partie le dévoilent. *Titanic* prend sa place.
  5. **Ordre** : les trois nouvelles questions occupent les positions 18 à 20, avant Sarah, Natalie et Daniel ; le discours de David reste le final (position 25). Seules les lignes créées aujourd'hui sont déplacées.
- **Alternatives écartées** : réécrire l'avatar de Karen et la chronique pour libérer le homard (touche du code, donc un redéploiement et un E2E, pour une seule question) ; la ville de la demande en mariage de Jamie (le prompt Gemini interdit déjà de citer une ville, mais l'idée reste disponible) ; passer à 21 manches.
- **Limites** : faits recoupés sur des pages de fans, pas sur le script. Le pack garde le nom « (20 manches) ».

### 2026-11-15 — D70 : Scores effacés quand un pack change
- **Contexte** : Intention I22. Le Grand Quiz Love Actually vient de changer trois fois (D67 à D69) alors que le tableau des scores (D63) mélangeait des parties jouées sur des versions différentes. L'auteur demande une remise à zéro de tous les quiz, puis un effacement automatique à chaque changement.
- **Décision** :
  1. **Remise à zéro** : toutes les lignes de `quiz_games` sont supprimées, après confirmation de l'auteur sur le décompte (46 parties, 25 participants, 122 réponses, sur 6 packs). Participants et réponses partent par cascade. Les 6 packs et leurs 70 questions ne sont pas touchés. Aucune sauvegarde, choix de l'auteur.
  2. **Déclencheur retenu par l'auteur : tout changement de jeu.** Une question, un choix, la bonne réponse, un média, un calage d'extrait ou l'activation d'une manche. Le nom et la description du pack n'en font pas partie.
  3. **`pack:sync`** : compare la base au JSON avant d'écrire. La simulation annonce le nombre de questions modifiées et de parties qui seront effacées ; `--apply` les efface après l'écriture. Une synchro sans différence n'efface rien.
  4. **Studio** : `purgePackScores` (`src/leaderboard.ts`) est appelée à l'enregistrement d'un pack existant dans l'éditeur (qui recréait déjà les questions et perdait les réponses, D38) et sur l'interrupteur d'une manche.
  5. **Test** : le test 10 de `npm test` crée un pack temporaire et une partie training, puis vérifie les quatre cas (sans différence, description seule, simulation, choix modifié) et la présence des deux appels du Studio.
- **Remplace** : la conservation de l'historique `quiz_answers` à travers les changements de pack (D30, D32, D38). La mise à jour sur place reste, pour garder l'identifiant du pack ; le refus de supprimer des questions aussi.
- **Alternatives écartées** : n'effacer que si les questions ou réponses changent, pas les médias (proposé, non retenu) ; versionner les packs et filtrer le tableau par version (garde l'historique, mais colonne et logique en plus pour un besoin que l'auteur n'a pas) ; déclencheur SQL sur `quiz_questions` (la base est partagée avec DraftMaster, et l'éditeur écrit question par question).
- **Limites** : modifier un pack pendant qu'une partie s'y joue supprime cette partie ; à faire entre deux parties, comme pour l'activation des manches (D38). La purge du Studio passe par la clé anon, comme la purge des trainings (D64). Constaté au passage : `packs/harry-potter.json` diffère de la base sur ses 10 questions ; non traité ici.

### 2026-11-18 — D71 : Party-Game TV « 🕺 Downing Street Groove » (Course 1, 2, 3 Soleil façon Lapins Crétins)
- **Contexte** : Intention I23. Prompt initial de l'auteur : *« En plus du quiz love actually, je me demande si on ne pourrait pas faire un petit jeu sur téléphone dans le navigateur. Pas lié à des connaissances mais peut être un jeu de course, je ne sais pas. On mettrait un thème love actually mais un truc fun, simple dans l'esprit lapins cretins de la grande époque »*.
  Lors des deux tours de questions de cadrage, l'auteur a tranché les 5 points suivants :
  - **Q1 (Format)** : *« Un seul mini-jeu phare ultra-léché »* (écartés : mini-triathlon de 3 épreuves de 30 s, menu d'arcade à la carte).
  - **Q2 (Mécanique / Scène Love Actually)** : *« 🕺 Downing Street Groove : danser dans les couloirs et se figer en Premier Ministre sérieux quand la porte s'ouvre »* (écartés : *Sprint à Heathrow*, *L'Emballage de Mr Bean*, *Tempête au Lac*).
  - **Q3 (Dispositif de jeu)** : *« 100 % Party-Game TV (la course s'affiche sur la TV, les téléphones servent de manettes) »* (écartés : 100 % sur téléphone, hybride solo + multi).
  - **Q4 (Condition de victoire)** : *« Course à la ligne d'arrivée (100 m) avec limite à 60 s : le 1er arrivé en bas de l'escalier l'emporte ! »* (écarté : chrono fixe de 45 s à la distance).
  - **Q5 (Contrôles manette)** : *« Pur "Lapins Crétins" ultra-lisible : 2 gros boutons GAUCHE / DROITE à alterner + STOP net quand la secrétaire ouvre la porte »* (écarté : troisième bouton bonus *Glissade sur la rampe*).
- **Décision** :
  1. **Isolation du quiz live (I20) & Zéro migration SQL** : le mini-jeu vit sur ses propres routes (`/host/groove/[id]` pour la TV et `/groove/[id]` pour les téléphones) et s'appuie sur `quiz_games` + `quiz_participants` en marquant la session avec `current_question_sequence = -1` et `is_training = true`. Ainsi, le salon réutilise le code PIN à 6 chiffres (avec redirection automatique depuis `/` vers `/groove/[id]` quand `current_question_sequence < 0`), le QR code et le choix d'avatar exclusif parmi les 15 personnages de *Love Actually*, sans jamais apparaître dans le tableau des scores des quiz.
  2. **Moteur pur (`src/groove.ts`)** : course de 100 m (`FINISH_DISTANCE = 100`, durée max `60 s`). Alterner GAUCHE / DROITE fait grimper le combo de groove (`+1,25 m` à `+1,75 m` par pas) ; répéter le même pied fait trébucher (`+0,25 m`, combo remis à 0). L'Écran Hôte pilote le cycle de la porte : `dancing` (3,5 s à 5,5 s) → `warning` (poignée qui tremble pendant 1,1 s : « ⚠️ LA PORTE BOUGE ! ») → `watching` (porte ouverte pendant 2,2 s à 3,0 s). Après 250 ms de grâce anti-latence réseau, tout tap pendant `watching` déclenche un « PRIS EN FLAG ! » (recul de 8 m, combo à 0, gel de honte de 2,5 s). Traverser `watching` sans bouger après avoir dansé donne un boost de reprise (`+2 m` de « Sang-froid britannique »). Dès que le 1er franchit les 100 m, un sprint final de 5 s permet aux poursuivants de finir avant le podium.
  3. **Synchronisation & Anti-spoil** : canal Supabase Realtime Broadcast `groove_sync_${gameId}` (pas des joueurs envoyés vers la TV arbitre, état officiel diffusé aux manettes) + effets sonores synthétisés au Web Audio API sur la TV (poignée, ouverture de porte, alarme de flag, fanfare) accompagnant *White Christmas* d'Otis Redding (BO de *Love Actually*, aucun spoil de la question Blind Test *Jump (For My Love)* du Grand Quiz).
  4. **Podium & Trophées** : Podium Top 3 et 4 trophées déterministes (*Roi du Déhanché*, *Grillé par la Secrétaire*, *Sang-Froid Britannique*, *Turbo des Pouces*) + bouton « 🔄 Rejouer la course » dans le même salon.
- **Alternatives écartées** : triathlon de 3 mini-jeux, bouton supplémentaire « Glissade », mode solo sans TV (écartés par l'auteur lors du cadrage).

### 2026-11-19 — D72 : Prénom obligatoire gardé en cookie & revue de Downing Street Groove
- **Contexte** : Intention I24. Revue du mini-jeu D71 avant livraison.
- **Constats sur le Groove** :
  1. Le test `tests/e2e/groove-game.spec.ts` ne pouvait pas passer : il cherchait un champ « Ton prénom » et un bouton « Entrer dans le salon » qui n'existent pas dans le Salon partagé (`src/app/game/[id]/lobby.tsx`).
  2. Le décompte 3, 2, 1 diffusait, jouait les sons et changeait de phase **dans un updater `setState`**, rejoué deux fois par React en mode strict (sons et diffusions en double en développement).
  3. La manette comparait la fin du gel (heure de la TV) à **sa propre horloge** : un téléphone décalé de quelques secondes affichait un gel trop long ou absent.
  4. Les boutons GAUCHE / DROITE réagissaient au `click` : sur mobile, deux pouces en alternance rapide perdent des pas. Passage à `pointerdown`.
  5. Rang affiché « #4e Place » : corrigé en « 4e place ». Les badges « Pris en flag » de la TV ne se rafraîchissaient qu'une fois par seconde : re-rendu à chaque tick de 250 ms.
- **Effets de bord sur les quiz** :
  1. Le Studio recréait le salon Groove **sans** `is_training` si la colonne manquait : la partie aurait compté comme une partie live terminée, avec tous les joueurs à 0 point, dans le tableau des scores du pack Love Actually. Repli supprimé, et `fetchPackScores` exclut désormais `current_question_sequence = -1`.
  2. Un lien `/game/<id>` d'un salon Groove ouvre la manette du Groove, et inversement : plus de quiz vide ni de course sur une partie de quiz.
  3. Reste connu : un salon Groove est rattaché à un pack Love Actually ; modifier ce pack pendant qu'une course se joue l'efface (D70), comme une partie de quiz.
- **Décision prénom** : le champ « Ton prénom ou pseudo » est obligatoire au Salon (quiz live et Groove) et en solo ; un prénom vide ou fait d'espaces désactive le bouton. Il est nettoyé (espaces, 18 caractères, pas de préfixe `[#avatar]`) puis gardé un an dans le cookie `quiz_player_name` (`Path=/`, `SameSite=Lax`), relu après le montage pour ne pas casser l'hydratation. Le cookie ne quitte pas le navigateur pour un usage serveur ; il n'a aucun rôle dans le classement solo (D65), qui reste fondé sur l'appareil et le prénom saisi.
- **Tests** : le joueur « Sam » des E2E saisit désormais son prénom ; le test Groove vérifie le bouton désactivé sans prénom, le cookie, le pré-remplissage sur un quiz enchaîné et la redirection `/game` → `/groove`.
- **Alternatives écartées** : `localStorage` (l'auteur a demandé un cookie, et l'identifiant de session y est déjà) ; prénom par défaut égal au personnage (c'était le comportement précédent, que l'auteur remplace).

### 2026-11-19 — D73 : Groove, touches remontées, décor de Noël et musique de la scène
- **Contexte** : Intention I25, après la première mise en ligne du Groove (D71, D72).
- **Touches trop basses** : la manette faisait `min-h-screen` (100vh) avec les touches tout en bas ; sur un téléphone, la barre du navigateur les poussait sous le bord. Elle fait maintenant `100dvh` sans défilement, respecte la zone sûre en bas (iPhone), et place les deux touches (34 % de la hauteur, entre 160 et 300 px) juste sous le signal de la porte, au milieu de l'écran. Le message « Pris en flag » a un emplacement réservé : les touches ne bougent plus quand il apparaît. Vérifié en 375×812.
- **Thème de Noël** : composant `src/components/GrooveDecor.tsx`, décoratif (`aria-hidden`), positions fixes pour l'hydratation, animations coupées si l'appareil demande moins de mouvement.
  - Sapin SVG (étoile, boules qui scintillent, guirlande dorée, cadeaux), guirlande lumineuse en festons, neige.
  - Manette : guirlande en haut, sapin sous les touches, jauge qui mène au 🎄, touches vert sapin (GAUCHE) et rouge (DROITE).
  - TV : guirlande en haut de page et au-dessus de la piste, sapin à côté du titre du salon, **sapin en ligne d'arrivée** de la piste (repère « 100 m • Sapin »), deux sapins autour du titre du podium. Le texte d'accueil dit « jusqu'au sapin de Noël, en bas de l'escalier ».
  - Quand la secrétaire ouvre la porte, guirlandes et sapin s'éteignent, puis se rallument à la fermeture.
- **Musique** : *White Christmas* (D71) n'est pas la musique de la scène. Le Groove joue l'extrait iTunes de la scène de danse, **le même que la manche Blind Test n° 2 du Grand Quiz**. Arbitrage de l'auteur, sur trois options : garder la musique de la scène et lancer le Groove **après** le Grand Quiz. Le Studio l'écrit sous le bouton de lancement. Aucun titre ni artiste n'apparaît à l'écran ni dans le code affiché ; le test 11 de `npm test` le vérifie toujours.
- **Alternatives écartées** : désactiver la manche Blind Test et la remplacer par une autre scène (efface les scores du pack, D70) ; garder *White Christmas* (aucun risque, mais pas la scène).
- **Limite** : un Groove lancé avant le Grand Quiz évente la manche 2. Rien ne l'empêche techniquement : c'est l'ordre de la soirée qui protège.

### 2026-11-19 — D74 : Retouche du Groove, livrée sans la suite E2E complète
- **Contexte** : l'auteur, au moment de livrer D73 : « *on shipe, on n'attend pas la suite complète quand je change juste un peu la partie game* ».
- **Décision** : une modification qui ne touche que le mini-jeu (`src/app/groove/`, `src/app/host/groove/`, `src/groove.ts`, `src/components/GrooveDecor.tsx`, l'encart Groove du Studio) se livre après `npm test` et `npx playwright test tests/e2e/groove-game.spec.ts` (~30 s). La suite complète (~13 à 17 min) reste obligatoire dès qu'un fichier partagé avec le quiz change : Salon, manette ou écran hôte du quiz, solo, scores, packs.
- **Appliqué à D73** : livré sur `npm test` et le test E2E du Groove ; la suite complète tournait encore au moment du push.

### 2026-11-19 — D75 : Groove, la secrétaire qui juge, la fausse sortie et le décor de la scène
- **Contexte** : Intention I26. L'auteur fournit deux captures de la scène (le Premier ministre qui danse, la secrétaire dans l'encadrement d'une double porte blanche, dossiers serrés contre elle ; l'escalier aux portraits noir et blanc) et veut que l'ambiance passe mieux : elle apparaît quand la musique baisse, elle surveille et juge, et repartir danser trop tôt alors qu'elle est encore là est sanctionné.
- **Mécanique** (`src/groove.ts`) :
  1. `warning` (1,1 s) : la musique **baisse en fondu** jusqu'à 12 % et la porte tremble, entrouverte.
  2. `watching` (2,1 à 3 s) : la secrétaire est dans l'encadrement, musique à 3 %. Sanction après 250 ms de grâce, comme avant.
  3. **Nouveau `lingering`** (une fois sur deux, 0,9 à 1,7 s) : la musique **repart** (fondu jusqu'à 50 %) mais elle est **toujours là**, sourcil levé, avec un « hmm » réprobateur. Tout pas est sanctionné **sans grâce** (`isLadyPresent`) : c'est le piège de la fausse sortie. Message dédié : « … est reparti trop tôt : elle était toujours là ! (-8 m) ».
  4. Elle s'en va (petit bruit de porte), la musique remonte, le bonus de sang-froid est versé comme avant.
- **Décor** (`src/components/DowningStreetScene.tsx`, dessins SVG originaux) : murs crème, corniche et lambris blancs, tableaux aux cadres dorés, appliques, console et lampe, double porte blanche aux poignées dorées (fermée, tremblante, puis ouverte sur la secrétaire), escalier qui descend vers l'arrivée avec portraits noir et blanc et rampe en fer forgé ; le sapin (D73) est au pied de l'escalier. Les couloirs de course deviennent des tapis rouges sur parquet. La secrétaire apparaît aussi dans le bandeau de la TV et sur la manette (encadrement crème à gauche du message), avec des messages par état : « 🔉 La musique baisse… », « 🧐 Fige-toi ! », « 😒 Elle est toujours là ! ».
- **Vérifié** dans le navigateur : la TV en 1440×900 et la manette en 375×812, dans les quatre états. Un pas envoyé pendant `lingering` déclenche bien le flag et le gel. `npm test` couvre la sanction sans grâce en `lingering`.
- **Choix laissés à l'agent** : la secrétaire n'est pas nommée (le film ne la présente pas) et est dessinée, pas photographiée (personne réelle). La fréquence de la fausse sortie (une fois sur deux) et ses durées sont des constantes de `src/groove.ts` (`LINGER_CHANCE`, `LINGER_MIN_MS`, `LINGER_MAX_MS`), faciles à régler après une répétition.
- **Alternatives écartées** : couper la musique pendant toute sa présence (pas de piège) ; une fausse sortie sans retour de la musique (le piège serait seulement visuel, moins drôle).

### 2026-11-19 — D76 : Écran TV du Groove, mis à l'échelle de l'écran et 15 couloirs sans défilement
- **Contexte** : Intention I27. TV 4K, mais l'image vient d'une Surface Pro 7 (2736×1824, mise à l'échelle 200 % par défaut) : le navigateur y voit une page de **1368×912** en 3:2, moins la barre d'onglets s'il n'est pas en plein écran (environ 1368×830).
- **Constat avant correction** (10 joueurs fictifs, 1368×830) : seuls **5 couloirs sur 10** étaient visibles, la page faisait 1525 px de haut ; au salon, le bouton « Lancer la course » était déjà sous le bord (920 px). Chaque couloir prenait 91 px (nom au-dessus, barre de 48 px dessous) et le décor 24 % de la hauteur.
- **Décision** :
  1. **Mise à l'échelle** : l'écran TV (`/host/groove/[id]`) est pensé pour 1920×1080 ; la taille de police racine vaut `16 px × min(largeur / 1920, hauteur / 1080)` (entre 8 et 48 px), recalculée au redimensionnement (`resize`, `ResizeObserver` et contrôle toutes les 2 s, l'événement seul ne suffisant pas) et rétablie en quittant la page. Les tailles en px du salon (QR code, petits textes, guirlande) passent en rem pour suivre.
  2. **Course en `100dvh`**, pleine largeur : plus de défilement. Le décor du couloir rétrécit selon le nombre de danseurs (26 % de la hauteur jusqu'à 4, 19 % jusqu'à 8, 14 % jusqu'à 12, 12 % au-delà).
  3. **Couloirs sur une ligne** (prénom, tapis rouge avec le pion, distance) dont la hauteur est calculée : `(100 − 26 − décor − 0,6 × n) / n` % de l'écran, entre 3 % et 9 %. Textes et pions proportionnels à cette hauteur. Avec de la place, une seconde ligne donne le personnage et l'état (flag, pose sérieuse, combo) ; sinon icônes à côté du prénom.
  4. **Le message de flag** s'affiche en surimpression sur le décor : la piste ne bouge plus quand il apparaît.
  5. **Bouton « ⛶ Plein écran »** au salon : sur la Surface, il rend la hauteur prise par la barre du navigateur.
  6. Salon : danseurs sur 4 colonnes en grand écran.
- **Mesures après correction** (15 joueurs, le maximum ; tous les couloirs visibles, page = hauteur d'écran) :
  | Fenêtre | Hauteur d'un couloir | Prénom |
  |---|---|---|
  | 1280×720 | 25 px | 11 px |
  | 1368×830 (Surface, fenêtre) | 29 px | 12 px |
  | 1368×912 (Surface, plein écran) | 32 px | 14 px |
  | 1920×1080 | 38 px | 16 px |
  | 2560×1440 | 51 px | 21 px |
  | 3840×2160 | 76 px | 32 px |
  À 10 joueurs sur la Surface en fenêtre : 42 px par couloir, prénoms en 17 px. Salon et podium tiennent aussi en 1368×830.
- **Alternatives écartées** : deux colonnes de couloirs au-delà de 10 joueurs (moins lisible pour voir qui mène) ; zoom CSS de toute la page (moins standard que la police racine) ; garder des tailles en px (illisible en 4K à 100 %, tronqué sur la Surface).
- **Limite** : en recopie d'écran, la TV 16:9 affiche l'image 3:2 de la Surface avec des bandes noires sur les côtés ; le plein écran du navigateur reste conseillé.
