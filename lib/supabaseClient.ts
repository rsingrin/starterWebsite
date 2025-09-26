// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ydwfrudncmkgvvcdrhdd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlkd2ZydWRuY21rZ3Z2Y2RyaGRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MjA5MTYsImV4cCI6MjA3NDM5NjkxNn0.X28AA4yUI09o_xhONme9xPlFcMGBTIEB6mryqg0nPbY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)