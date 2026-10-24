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
| **D08** | 2026-10-24 | Diffusion sonore (`Q03 -> A`) | **Lecture audio sur l'Écran Hôte par défaut** (TV / PC relié aux enceintes du salon), avec un **bouton optionnel "🎧 Activer le son sur mon téléphone"** sur la Manette Joueur pour les parties à distance. | Adopté |
| **D09** | 2026-10-24 | Studio d'édition & Import/Export (`Q04 -> A`) | **Studio d'édition web dans `/host/dashboard`** protégé par le mot de passe Hôte (`SITE_PASSWORD`), accompagné d'une fonction **Import / Export JSON** pour sauvegarder ou générer des packs via IA. | Adopté |
| **D10** | 2026-10-24 | Fiabilisation CSS, Synchro Hybride & Ergonomie Multi-Onglets | Supprimer le double import `globals.css` dans `/host/dashboard/layout.tsx` (qui cassait le chunk CSS Tailwind sur `/game/[id]`), ajouter un polling léger (1,5s) en complément de Supabase Realtime, et afficher des liens croisés Hôte ⇄ Manette pour faciliter le test sur un seul PC. | Adopté |
| **D11** | 2026-10-24 | Timer anti-veille d'onglet & Bouton Rejouer *(partie clic Hôte remplacée par D13)* | Remplacer `onComplete` de `requestAnimationFrame` par `setTimeout` sur `/game/[id]` pour éviter le gel des onglets en arrière-plan, et ajouter un bouton « Rejouer ce Pack » sur le podium. *(Le clic de réponse sur l'Hôte a été écarté par D13).* | Partiellement remplacé par **D13** |
| **D12** | 2026-10-24 | Mot de passe Studio Hôte dédié & Livraison GitHub/Railway | Définir le mot de passe du Studio Hôte (`SITE_PASSWORD`) sur `Quiz007!` (distinct de DraftMaster) et publier le dépôt sur GitHub (`tristanlenours/Quiz`) prêt à être déployé en 1 clic sur Railway. | Adopté |
| **D13** | 2026-10-24 | Séparation stricte Écran Hôte (TV) vs Manette Joueur | Revenir à des propositions purement visuelles (non cliquables) sur l'Écran Hôte (`/host/game/[id]`). Seules les Manettes Joueurs (`/game/[id]`) peuvent soumettre des réponses. | Adopté |
| **D14** | 2026-10-24 | Mise à niveau sécurité Next.js (`>= 14.2.35`) pour Railway Railpack | Mettre à jour `next`, `@next/mdx` et `eslint-config-next` de `14.2.15` vers `^14.2.35` afin de corriger les CVE (`CVE-2025-55184`, `CVE-2025-67779`) bloquées par le scanner de sécurité de Railway (`railpack-v0.43.0`). | Adopté |

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
