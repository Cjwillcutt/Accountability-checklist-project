import { supabase } from "./supabase";

export interface Profile {
  id: string;
  username: string;
  created_at: string;
}

export async function createProfile(userId: string, username: string): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .insert({ id: userId, username: username.trim() })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) return null;
  return data;
}

export async function checkUsernameAvailable(username: string): Promise<boolean> {
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username.trim())
    .maybeSingle();

  return !data;
}
