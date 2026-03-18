-- Supabase 대시보드 > SQL Editor 에 붙여넣고 Run 클릭

create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  updated_at timestamp with time zone default now()
);

create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  category text check (category in ('Study', 'JobApp', 'Personal')) default 'Personal',
  is_done boolean default false,
  start_time timestamp with time zone,
  date date not null default current_date,
  created_at timestamp with time zone default now()
);

alter table public.tasks    enable row level security;
alter table public.profiles enable row level security;

create policy "own tasks"   on tasks    for all using (auth.uid() = user_id);
create policy "own profile" on profiles for all using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
