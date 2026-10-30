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
| **I18** | 2026-10-30 | **Grand Quiz Love Actually à 15 questions** : au-delà, les joueurs se lassent. Les questions retirées sont **désactivées, pas supprimées**, pour pouvoir les remettre ou changer celles qui sont désactivées. | Demande explicite auteur | Actif |
| **I19** | 2026-10-30 | Tout le thème Harry Potter en mode **« Jean-Michel à peu près »** : vrais noms, mais descriptions très approximatives de quelqu'un qui a regardé les films de loin et aimerait aimer, sans que ça prenne. | Demande explicite auteur | Actif |

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
