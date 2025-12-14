// Supabase client configuration

import { createClient } from "@supabase/supabase-js";
import { env } from "./env.config.js";

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_API_KEY);

export default supabase;
