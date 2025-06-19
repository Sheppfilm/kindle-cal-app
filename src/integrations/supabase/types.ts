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
      calendar_events: {
        Row: {
          all_day: boolean | null
          attendees: Json | null
          conference_data: Json | null
          created_at: string
          creator_email: string | null
          creator_name: string | null
          description: string | null
          end_time: string
          event_type: string | null
          google_event_id: string
          hangout_link: string | null
          html_link: string | null
          ical_uid: string | null
          id: string
          kind: string | null
          location: string | null
          organizer_email: string | null
          organizer_name: string | null
          raw_data: Json | null
          recurrence: string[] | null
          sequence: number | null
          start_time: string
          status: string | null
          title: string
          transparency: string | null
          updated_at: string
          user_id: string
          visibility: string | null
        }
        Insert: {
          all_day?: boolean | null
          attendees?: Json | null
          conference_data?: Json | null
          created_at?: string
          creator_email?: string | null
          creator_name?: string | null
          description?: string | null
          end_time: string
          event_type?: string | null
          google_event_id: string
          hangout_link?: string | null
          html_link?: string | null
          ical_uid?: string | null
          id?: string
          kind?: string | null
          location?: string | null
          organizer_email?: string | null
          organizer_name?: string | null
          raw_data?: Json | null
          recurrence?: string[] | null
          sequence?: number | null
          start_time: string
          status?: string | null
          title: string
          transparency?: string | null
          updated_at?: string
          user_id: string
          visibility?: string | null
        }
        Update: {
          all_day?: boolean | null
          attendees?: Json | null
          conference_data?: Json | null
          created_at?: string
          creator_email?: string | null
          creator_name?: string | null
          description?: string | null
          end_time?: string
          event_type?: string | null
          google_event_id?: string
          hangout_link?: string | null
          html_link?: string | null
          ical_uid?: string | null
          id?: string
          kind?: string | null
          location?: string | null
          organizer_email?: string | null
          organizer_name?: string | null
          raw_data?: Json | null
          recurrence?: string[] | null
          sequence?: number | null
          start_time?: string
          status?: string | null
          title?: string
          transparency?: string | null
          updated_at?: string
          user_id?: string
          visibility?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          google_access_token: string | null
          google_refresh_token: string | null
          google_sync_token: string | null
          id: string
          last_sync: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          google_access_token?: string | null
          google_refresh_token?: string | null
          google_sync_token?: string | null
          id: string
          last_sync?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          google_access_token?: string | null
          google_refresh_token?: string | null
          google_sync_token?: string | null
          id?: string
          last_sync?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      upsert_calendar_event: {
        Args: {
          p_user_id: string
          p_google_event_id: string
          p_title: string
          p_description: string
          p_start_time: string
          p_end_time: string
          p_location: string
          p_all_day: boolean
          p_recurrence: string[]
          p_status: string
          p_visibility: string
          p_creator_email: string
          p_creator_name: string
          p_organizer_email: string
          p_organizer_name: string
          p_attendees: Json
          p_conference_data: Json
          p_hangout_link: string
          p_html_link: string
          p_ical_uid: string
          p_kind: string
          p_sequence: number
          p_transparency: string
          p_event_type: string
          p_raw_data: Json
        }
        Returns: string
      }
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
