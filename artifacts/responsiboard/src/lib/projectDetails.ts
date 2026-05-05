import { supabase } from "./supabase";

export interface Deadline {
  id: string;
  project_id: string;
  label: string;
  date: string;
}

export interface ChecklistItem {
  id: string;
  project_id: string;
  text: string;
  done: boolean;
}

export interface ProjectMember {
  id: string;
  project_id: string;
  email: string;
}

export interface ProjectFile {
  id: string;
  project_id: string;
  name: string;
  path: string;
  url: string;
  size: number;
  created_at: string;
}

export interface ProjectDetail {
  id: string;
  name: string;
  notes: string;
  created_at: string;
  user_id: string;
}

export async function fetchProjectById(id: string): Promise<ProjectDetail | null> {
  const { data, error } = await supabase.from("projects").select("*").eq("id", id).single();
  if (error) return null;
  return data;
}

export async function updateProjectName(id: string, name: string): Promise<void> {
  const { error } = await supabase.from("projects").update({ name }).eq("id", id);
  if (error) throw error;
}

export async function updateProjectNotes(id: string, notes: string): Promise<void> {
  const { error } = await supabase.from("projects").update({ notes }).eq("id", id);
  if (error) throw error;
}

// Deadlines
export async function fetchDeadlines(projectId: string): Promise<Deadline[]> {
  const { data, error } = await supabase.from("project_deadlines").select("*").eq("project_id", projectId).order("date");
  if (error) throw error;
  return data ?? [];
}

export async function addDeadline(projectId: string, label: string, date: string): Promise<Deadline> {
  const { data, error } = await supabase.from("project_deadlines").insert({ project_id: projectId, label, date }).select().single();
  if (error) throw error;
  return data;
}

export async function deleteDeadline(id: string): Promise<void> {
  const { error } = await supabase.from("project_deadlines").delete().eq("id", id);
  if (error) throw error;
}

// Checklist
export async function fetchChecklist(projectId: string): Promise<ChecklistItem[]> {
  const { data, error } = await supabase.from("project_checklist_items").select("*").eq("project_id", projectId).order("created_at");
  if (error) throw error;
  return data ?? [];
}

export async function addChecklistItem(projectId: string, text: string): Promise<ChecklistItem> {
  const { data, error } = await supabase.from("project_checklist_items").insert({ project_id: projectId, text, done: false }).select().single();
  if (error) throw error;
  return data;
}

export async function toggleChecklistItem(id: string, done: boolean): Promise<void> {
  const { error } = await supabase.from("project_checklist_items").update({ done }).eq("id", id);
  if (error) throw error;
}

export async function deleteChecklistItem(id: string): Promise<void> {
  const { error } = await supabase.from("project_checklist_items").delete().eq("id", id);
  if (error) throw error;
}

// Members
export async function fetchMembers(projectId: string): Promise<ProjectMember[]> {
  const { data, error } = await supabase.from("project_members").select("*").eq("project_id", projectId).order("created_at");
  if (error) throw error;
  return data ?? [];
}

export async function addMember(projectId: string, email: string): Promise<ProjectMember> {
  const { data, error } = await supabase.from("project_members").insert({ project_id: projectId, email }).select().single();
  if (error) throw error;
  return data;
}

export async function deleteMember(id: string): Promise<void> {
  const { error } = await supabase.from("project_members").delete().eq("id", id);
  if (error) throw error;
}

// Files
export async function fetchFiles(projectId: string): Promise<ProjectFile[]> {
  const { data, error } = await supabase
    .from("project_files")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at");
  if (error) throw error;
  return data ?? [];
}

export async function uploadFile(projectId: string, file: File): Promise<ProjectFile> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${projectId}/${Date.now()}_${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from("project-files")
    .upload(path, file, { upsert: false });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from("project-files")
    .getPublicUrl(path);

  const { data, error } = await supabase
    .from("project_files")
    .insert({ project_id: projectId, name: file.name, path, url: urlData.publicUrl, size: file.size })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteFile(id: string, path: string): Promise<void> {
  await supabase.storage.from("project-files").remove([path]);
  const { error } = await supabase.from("project_files").delete().eq("id", id);
  if (error) throw error;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
