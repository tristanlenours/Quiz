# Quiz & Blind Test — Domaine & Contexte Produit

Vocabulaire canonique et cadre architectural du projet de **Quiz & Blind Test personnel** (type Kahoot), conçu pour cohabiter avec **DraftMaster (LMCDEU)** sur la même infrastructure **Supabase + Railway**.

---

## 1. Vision & Intention Globale

Disposer d'une plateforme personnelle, rapide et conviviale de **Quiz interactif et Blind Test musical** pour des soirées entre amis ou en famille :
- **Un écran maître (Hôte)** projeté sur TV / écran partagé qui pilote la partie, affiche le QR code de connexion, diffuse les extraits audio du Blind Test, affiche le compte à rebours et révèle les réponses ainsi que le podium.
- **Des écrans joueurs (Manettes mobiles)** accessibles instantanément via QR code / code PIN sur smartphone, sans création de compte lourde, pour répondre au plus vite.
- **Une infrastructure mutualisée avec DraftMaster** : hébergement applicatif sur **Railway** et base PostgreSQL + Realtime dans le **même projet Supabase** que DraftMaster, ce qui évite la limite du nombre de projets et **maintient la base Supabase active** (anti-pause du plan Free).

---

## 2. Vocabulaire Canonique

**Pack de jeu (`quiz_sets`)** :
Une collection ordonnée de manches/questions pouvant mêler des questions de culture générale (Quiz) et des extraits musicaux (Blind Test).
_Éviter_ : Deck, questionnaire, playlist.

**Manche / Question (`quiz_questions`)** :
Une étape individuelle d'un Pack de jeu, caractérisée par un type (`standard_qcm`, `blind_test_qcm`, ou `blind_test_open`), un intitulé, un média éventuel (`image_url`, `audio_url`, `audio_start_sec`, `audio_duration_sec`), et les métadonnées de révélation (`reveal_title`, `reveal_artist`, `reveal_cover_url`).
_Éviter_ : Slide, carte.

**Extrait Audio** :
Le flux sonore (URL MP3/OGG dans Supabase Storage, aperçu musical externe, etc.) joué par l'Écran Hôte (et optionnellement sur les Manettes Joueurs) pendant la phase d'écoute d'une manche de Blind Test.

**Phase de révélation (`is_answer_revealed`)** :
L'état d'une manche une fois le chronomètre écoulé ou lorsque tous les joueurs ont répondu. En mode Blind Test, c'est uniquement à cet instant que le titre, l'artiste et la pochette de l'œuvre sont affichés à l'écran.

**Session de jeu (`quiz_games`)** :
Une instance live lancée par l'Hôte à partir d'un Pack de jeu, identifiée par un identifiant et un code PIN court permettant de rejoindre le Salon d'attente (`lobby`).
_Éviter_ : Partie seule quand on parle de la structure persistée, room.

**Écran Hôte (`/host`)** :
L'interface grand écran (TV / ordinateur branché au son) qui orchestre la Session de jeu, joue les Extraits Audio et projette le classement.
_Éviter_ : Back-office, admin (réservé à l'éditeur de packs).

**Manette Joueur (`/game/[id]`)** :
L'interface mobile minimaliste du participant, focalisée sur la rapidité de réponse au pouce.

**Score de rapidité** :
Calcul de points récompensant à la fois l'exactitude et la vitesse de réponse par rapport au début effectif de la question ou de l'Extrait Audio (de 0 à 1 000 points par manche).

**Avatar Exclusif (`src/avatars.ts`, `quiz_participants.avatar_id`)** :
Personnage issu du thème associé au pack (par défaut *Love Actually* et ses 15 personnages emblématiques) choisi par un participant dans le Salon d'attente. Dès qu'un personnage est sélectionné dans une Session de jeu, il est verrouillé en temps réel pour les autres participants et accompagne le joueur à tous les étages (salon, bandeau joueur, mini-podium de manche, grand Podium Top 3 final).

**Débrief du Réalisateur & Trophées Spéciaux (`/api/game-analysis`)** :
Analyse humoristique de fin de partie générée à partir des statistiques réelles des joueurs (vitesse, précision, séries, remontada), combinant des **Trophées déterministes** (*Lucky Luke du Buzzer*, *Sniper de Downing Street*, *Prix Mr Bean de l'Emballage*, *Sprint Final à Heathrow*) et une **chronique personnalisée** propulsée par l'API gratuite **Gemini** (`GEMINI_API_KEY`) avec repli déterministe automatique.

---

## 3. Architecture & Cohabitation Supabase / Railway

```text
[TV / PC : Écran Hôte]          [Smartphones : Manettes Joueurs]
         |                                     |
         +------------------+------------------+
                            |
                            v
         [Application Next.js / React sur Railway]
                            |
                            v
         [Projet Supabase partagé avec DraftMaster]
           |-- Tables DraftMaster : magiciens_profiles, draft_records, tournaments...
           |-- Tables Quiz        : quiz_sets, quiz_questions, quiz_choices,
           |                        quiz_games, quiz_participants, quiz_answers
           |-- Vue Quiz           : quiz_game_results
           |-- Supabase Realtime  : synchronisation live des états de manche et réponses
           |-- Supabase Storage   : bucket public/signé pour extraits audio & images
```

### Invariants de cohabitation :
1. **Isolation par préfixe `quiz_`** : Toutes les tables, vues et fonctions SQL créées pour ce projet portent le préfixe `quiz_` afin de ne jamais entrer en collision avec les tables de DraftMaster et de rester immédiatement identifiables dans Supabase Studio.
2. **Maintien d'activité (Keep-Alive)** : L'utilisation croisée de DraftMaster et du Quiz sur la même base Supabase génère du trafic PostgreSQL régulier empêchant la mise en veille automatique du projet Supabase.
