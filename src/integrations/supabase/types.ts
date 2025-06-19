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
      carousel_slides: {
        Row: {
          caption: string | null
          created_at: string | null
          id: string
          image_url: string
          post_id: string | null
          slide_order: number
          user_id: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          id?: string
          image_url: string
          post_id?: string | null
          slide_order: number
          user_id?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          id?: string
          image_url?: string
          post_id?: string | null
          slide_order?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "carousel_slides_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      linkedin_posts: {
        Row: {
          content: string
          created_at: string
          id: string
          scheduled_date: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          scheduled_date?: string | null
          status: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          scheduled_date?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          caption: string
          comments: number | null
          created_at: string | null
          id: string
          image_url: string
          is_carousel: boolean | null
          likes: number | null
          pinned: boolean | null
          scheduled_day: string
          thumbnail_url: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          caption: string
          comments?: number | null
          created_at?: string | null
          id?: string
          image_url: string
          is_carousel?: boolean | null
          likes?: number | null
          pinned?: boolean | null
          scheduled_day: string
          thumbnail_url?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          caption?: string
          comments?: number | null
          created_at?: string | null
          id?: string
          image_url?: string
          is_carousel?: boolean | null
          likes?: number | null
          pinned?: boolean | null
          scheduled_day?: string
          thumbnail_url?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      press_release_files: {
        Row: {
          created_at: string
          file_name: string
          file_type: string
          file_url: string
          id: string
          press_release_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          file_name: string
          file_type: string
          file_url: string
          id?: string
          press_release_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          file_name?: string
          file_type?: string
          file_url?: string
          id?: string
          press_release_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "press_release_files_press_release_id_fkey"
            columns: ["press_release_id"]
            isOneToOne: false
            referencedRelation: "press_releases"
            referencedColumns: ["id"]
          },
        ]
      }
      press_releases: {
        Row: {
          content: string
          created_at: string
          id: string
          immediate_release: boolean
          language: string
          media_contact_email: string | null
          media_contact_name: string | null
          media_contact_phone: string | null
          parent_release_id: string | null
          project_name: string
          scheduled_release_date: string | null
          subtitle: string | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          immediate_release?: boolean
          language?: string
          media_contact_email?: string | null
          media_contact_name?: string | null
          media_contact_phone?: string | null
          parent_release_id?: string | null
          project_name: string
          scheduled_release_date?: string | null
          subtitle?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          immediate_release?: boolean
          language?: string
          media_contact_email?: string | null
          media_contact_name?: string | null
          media_contact_phone?: string | null
          parent_release_id?: string | null
          project_name?: string
          scheduled_release_date?: string | null
          subtitle?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "press_releases_parent_release_id_fkey"
            columns: ["parent_release_id"]
            isOneToOne: false
            referencedRelation: "press_releases"
            referencedColumns: ["id"]
          },
        ]
      }
      stories: {
        Row: {
          created_at: string | null
          day: string
          duration: number | null
          id: string
          image_url: string
          story_order: number
          user_id: string | null
          week_id: string | null
        }
        Insert: {
          created_at?: string | null
          day: string
          duration?: number | null
          id?: string
          image_url: string
          story_order: number
          user_id?: string | null
          week_id?: string | null
        }
        Update: {
          created_at?: string | null
          day?: string
          duration?: number | null
          id?: string
          image_url?: string
          story_order?: number
          user_id?: string | null
          week_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stories_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "story_weeks"
            referencedColumns: ["id"]
          },
        ]
      }
      story_weeks: {
        Row: {
          created_at: string
          description: string | null
          end_date: string
          id: string
          start_date: string
          user_id: string | null
          week_name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date: string
          id?: string
          start_date: string
          user_id?: string | null
          week_name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string
          id?: string
          start_date?: string
          user_id?: string | null
          week_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
