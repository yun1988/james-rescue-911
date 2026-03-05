export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      disturbance_events: {
        Row: {
          id: string;
          timestamp: string;
          disturber_name: string;
          request_type: string;
          description: string | null;
          source: string;
          level: string;
        };
        Insert: {
          id?: string;
          timestamp?: string;
          disturber_name: string;
          request_type?: string;
          description?: string | null;
          source?: string;
          level?: string;
        };
        Update: {
          id?: string;
          timestamp?: string;
          disturber_name?: string;
          request_type?: string;
          description?: string | null;
          source?: string;
          level?: string;
        };
      };
    };
  };
}
