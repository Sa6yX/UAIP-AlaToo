export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      academic_programs: {
        Row: {
          code: string
          created_at: string
          degree: string
          faculty: string
          id: string
          language: string
          name: string
          source_status: string | null
          source_title: string | null
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          degree?: string
          faculty?: string
          id?: string
          language?: string
          name: string
          source_status?: string | null
          source_title?: string | null
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          degree?: string
          faculty?: string
          id?: string
          language?: string
          name?: string
          source_status?: string | null
          source_title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      catalog_courses: {
        Row: {
          course_code: string
          course_name: string
          created_at: string
          credits: number
          description: string | null
          grading_components: Json
          id: string
          is_placeholder: boolean
          outcomes: Json
          practice_hours_raw: string
          source_hash: string
          source_kind: string
          teachers: Json
          theory_hours: number
          updated_at: string
        }
        Insert: {
          course_code: string
          course_name: string
          created_at?: string
          credits?: number
          description?: string | null
          grading_components?: Json
          id?: string
          is_placeholder?: boolean
          outcomes?: Json
          practice_hours_raw?: string
          source_hash: string
          source_kind?: string
          teachers?: Json
          theory_hours?: number
          updated_at?: string
        }
        Update: {
          course_code?: string
          course_name?: string
          created_at?: string
          credits?: number
          description?: string | null
          grading_components?: Json
          id?: string
          is_placeholder?: boolean
          outcomes?: Json
          practice_hours_raw?: string
          source_hash?: string
          source_kind?: string
          teachers?: Json
          theory_hours?: number
          updated_at?: string
        }
        Relationships: []
      }
      curriculum_offerings: {
        Row: {
          catalog_course_id: string
          created_at: string
          elective_group_id: string | null
          grade: number
          id: string
          is_elective_slot: boolean
          is_marked: boolean
          notes_raw: string | null
          overall_semester: number
          row_number: number | null
          semester_in_grade: number
          semester_total_credits: number | null
          source_hash: string
          updated_at: string
        }
        Insert: {
          catalog_course_id: string
          created_at?: string
          elective_group_id?: string | null
          grade: number
          id?: string
          is_elective_slot?: boolean
          is_marked?: boolean
          notes_raw?: string | null
          overall_semester: number
          row_number?: number | null
          semester_in_grade: number
          semester_total_credits?: number | null
          source_hash: string
          updated_at?: string
        }
        Update: {
          catalog_course_id?: string
          created_at?: string
          elective_group_id?: string | null
          grade?: number
          id?: string
          is_elective_slot?: boolean
          is_marked?: boolean
          notes_raw?: string | null
          overall_semester?: number
          row_number?: number | null
          semester_in_grade?: number
          semester_total_credits?: number | null
          source_hash?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "curriculum_offerings_catalog_course_id_fkey"
            columns: ["catalog_course_id"]
            isOneToOne: false
            referencedRelation: "catalog_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "curriculum_offerings_catalog_course_id_fkey"
            columns: ["catalog_course_id"]
            isOneToOne: false
            referencedRelation: "catalog_offerings_v1"
            referencedColumns: ["course_id"]
          },
          {
            foreignKeyName: "curriculum_offerings_elective_group_id_fkey"
            columns: ["elective_group_id"]
            isOneToOne: false
            referencedRelation: "elective_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      elective_group_courses: {
        Row: {
          course_id: string
          created_at: string
          elective_group_id: string
          id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          elective_group_id: string
          id?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          elective_group_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "elective_group_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "catalog_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "elective_group_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "catalog_offerings_v1"
            referencedColumns: ["course_id"]
          },
          {
            foreignKeyName: "elective_group_courses_elective_group_id_fkey"
            columns: ["elective_group_id"]
            isOneToOne: false
            referencedRelation: "elective_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      elective_groups: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          name: string
          scope: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          scope?: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          scope?: string
          updated_at?: string
        }
        Relationships: []
      }
      offering_audiences: {
        Row: {
          created_at: string
          id: string
          offering_id: string
          program_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          offering_id: string
          program_id: string
        }
        Update: {
          created_at?: string
          id?: string
          offering_id?: string
          program_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "offering_audiences_offering_id_fkey"
            columns: ["offering_id"]
            isOneToOne: false
            referencedRelation: "curriculum_offerings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offering_audiences_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "academic_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offering_audiences_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "catalog_offerings_v1"
            referencedColumns: ["program_id"]
          },
        ]
      }
      offering_option_courses: {
        Row: {
          course_id: string
          created_at: string
          id: string
          offering_id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          offering_id: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          offering_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "offering_option_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "catalog_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offering_option_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "catalog_offerings_v1"
            referencedColumns: ["course_id"]
          },
          {
            foreignKeyName: "offering_option_courses_offering_id_fkey"
            columns: ["offering_id"]
            isOneToOne: false
            referencedRelation: "curriculum_offerings"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      catalog_cards_v1: {
        Row: {
          browse_id: string | null
          course_code: string | null
          course_id: string | null
          course_name: string | null
          credits: number | null
          description: string | null
          elective_group_code: string | null
          elective_group_name: string | null
          grade: number | null
          grade_label: string | null
          grading_components: Json | null
          is_elective: boolean | null
          is_placeholder: boolean | null
          notes_raw: string | null
          offering_id: string | null
          outcomes: Json | null
          overall_semester: number | null
          practice_hours_raw: string | null
          program_codes: string[] | null
          program_names: string[] | null
          semester_in_grade: number | null
          shared_program_count: number | null
          source_kind: string | null
          source_type: string | null
          teachers: Json | null
          theory_hours: number | null
        }
        Relationships: []
      }
      catalog_offerings_v1: {
        Row: {
          audience_id: string | null
          course_code: string | null
          course_id: string | null
          course_name: string | null
          credits: number | null
          description: string | null
          elective_group_code: string | null
          elective_group_name: string | null
          grade: number | null
          grade_label: string | null
          grading_components: Json | null
          is_elective_slot: boolean | null
          is_marked: boolean | null
          is_placeholder: boolean | null
          notes_raw: string | null
          offering_id: string | null
          option_course_codes: string[] | null
          option_course_names: string[] | null
          outcomes: Json | null
          overall_semester: number | null
          practice_hours_raw: string | null
          program_code: string | null
          program_id: string | null
          program_name: string | null
          semester_in_grade: number | null
          shared_program_codes: string[] | null
          shared_program_count: number | null
          shared_program_names: string[] | null
          source_kind: string | null
          teachers: Json | null
          theory_hours: number | null
        }
        Relationships: [
          {
            foreignKeyName: "offering_audiences_offering_id_fkey"
            columns: ["offering_id"]
            isOneToOne: false
            referencedRelation: "curriculum_offerings"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
