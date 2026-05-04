-- Run this in your Supabase dashboard → SQL Editor → New Query

-- 1. Create the projects table
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null default 'Untitled Project',
  created_at timestamptz default now() not null
);

-- 2. Enable Row Level Security (users only see their own projects)
alter table projects enable row level security;

-- 3. RLS Policies
create policy "Users can view own projects"
  on projects for select
  using (auth.uid() = user_id);

create policy "Users can create own projects"
  on projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update own projects"
  on projects for update
  using (auth.uid() = user_id);

create policy "Users can delete own projects"
  on projects for delete
  using (auth.uid() = user_id);
