# 🎵 Quiz & Blind Test Perso (Kahoot-like)

Plateforme personnelle de **Quiz interactif & Blind Test musical** en temps réel, propulsée par **Next.js 14**, **Supabase Realtime** et **Tailwind CSS**, conçue pour partager la base Supabase et le compte **Railway** de **DraftMaster (LMCDEU)**.

---

## 🧭 Gouvernance Intent-Driven & Journal des Micro-Décisions

Ce dépôt est piloté par les intentions :
- **[`DECISIONS.md`](./DECISIONS.md)** : Registre des intentions de l'auteur (`I01`–`I05`), des micro-décisions adoptées (`D01`–`D09`) et journal chronologique détaillé (ADR).
- **[`CONTEXT.md`](./CONTEXT.md)** : Vocabulaire canonique du domaine (Pack de jeu, Manche, Extrait Audio, Révélation, Écran Hôte, Manette Joueur) et architecture mutualisée avec DraftMaster.
- **[`AGENTS.md`](./AGENTS.md)** & **[`.specify/constitution.md`](./.specify/constitution.md)** : Règles de contribution et invariants non-négociables.

---

## 🚀 Mise en route rapide (Local & Supabase partagé)

### 1. Créer les tables `quiz_*` dans le projet Supabase de DraftMaster
Dans le **SQL Editor** de ton projet Supabase DraftMaster, copie-colle et exécute :
- **[`supabase/schema_shared_draftmaster.sql`](./supabase/schema_shared_draftmaster.sql)**

Toutes les tables sont préfixées par `quiz_` (`quiz_sets`, `quiz_questions`, `quiz_choices`, `quiz_games`, `quiz_participants`, `quiz_answers`, `quiz_game_results`) : **aucune table de DraftMaster n'est modifiée**.

### 2. Lancer le serveur de développement
Le fichier `.env.local` est déjà pré-configuré avec les clés Supabase de DraftMaster :
```bash
npm run dev
```
- **Accès Joueur (Code PIN)** : `http://localhost:3000`
- **Studio Hôte (Création de packs, Recherche iTunes Blind Test, Lancement sur TV)** : `http://localhost:3000/host/dashboard`
*(Déverrouillage avec le même `SITE_PASSWORD` que DraftMaster).*
