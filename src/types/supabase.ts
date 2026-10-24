export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      quiz_answers: {
        Row: {
          choice_id: string | null
          created_at: string
          id: string
          participant_id: string
          question_id: string
          score: number
          text_answer: string | null
        }
        Insert: {
          choice_id?: string | null
          created_at?: string
          id?: string
          participant_id: string
          question_id: string
          score: number
          text_answer?: string | null
        }
        Update: {
          choice_id?: string | null
          created_at?: string
          id?: string
          participant_id?: string
          question_id?: string
          score?: number
          text_answer?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_answers_choice_id_fkey"
            columns: ["choice_id"]
            isOneToOne: false
            referencedRelation: "quiz_choices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_answers_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "quiz_game_results"
            referencedColumns: ["participant_id"]
          },
          {
            foreignKeyName: "quiz_answers_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "quiz_participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_choices: {
        Row: {
          body: string
          created_at: string
          id: string
          is_correct: boolean
          question_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          is_correct?: boolean
          question_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          is_correct?: boolean
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_choices_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_games: {
        Row: {
          created_at: string
          current_question_sequence: number
          id: string
          is_answer_revealed: boolean
          phase: string
          pin_code: string
          quiz_set_id: string
        }
        Insert: {
          created_at?: string
          current_question_sequence?: number
          id?: string
          is_answer_revealed?: boolean
          phase?: string
          pin_code?: string
          quiz_set_id: string
        }
        Update: {
          created_at?: string
          current_question_sequence?: number
          id?: string
          is_answer_revealed?: boolean
          phase?: string
          pin_code?: string
          quiz_set_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_games_quiz_set_id_fkey"
            columns: ["quiz_set_id"]
            isOneToOne: false
            referencedRelation: "quiz_sets"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_participants: {
        Row: {
          client_session_id: string
          created_at: string
          game_id: string
          id: string
          nickname: string
        }
        Insert: {
          client_session_id: string
          created_at?: string
          game_id: string
          id?: string
          nickname: string
        }
        Update: {
          client_session_id?: string
          created_at?: string
          game_id?: string
          id?: string
          nickname?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_participants_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "quiz_games"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          audio_duration_sec: number
          audio_start_sec: number
          audio_url: string | null
          video_url: string | null
          body: string
          created_at: string
          id: string
          image_url: string | null
          order: number
          question_type: "quiz" | "blind_test"
          quiz_set_id: string
          reveal_artist: string | null
          reveal_cover_url: string | null
          reveal_title: string | null
        }
        Insert: {
          audio_duration_sec?: number
          audio_start_sec?: number
          audio_url?: string | null
          video_url?: string | null
          body: string
          created_at?: string
          id?: string
          image_url?: string | null
          order: number
          question_type?: "quiz" | "blind_test"
          quiz_set_id: string
          reveal_artist?: string | null
          reveal_cover_url?: string | null
          reveal_title?: string | null
        }
        Update: {
          audio_duration_sec?: number
          audio_start_sec?: number
          audio_url?: string | null
          video_url?: string | null
          body?: string
          created_at?: string
          id?: string
          image_url?: string | null
          order?: number
          question_type?: "quiz" | "blind_test"
          quiz_set_id?: string
          reveal_artist?: string | null
          reveal_cover_url?: string | null
          reveal_title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_set_id_fkey"
            columns: ["quiz_set_id"]
            isOneToOne: false
            referencedRelation: "quiz_sets"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_sets: {
        Row: {
          created_at: string
          description: string | null
          id: string
          mode: "quiz" | "blind_test" | "mixed"
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          mode?: "quiz" | "blind_test" | "mixed"
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          mode?: "quiz" | "blind_test" | "mixed"
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      quiz_game_results: {
        Row: {
          game_id: string | null
          nickname: string | null
          participant_id: string | null
          total_score: number | null
        }
        Relationships: []
      }
    }
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
