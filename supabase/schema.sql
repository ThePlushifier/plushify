-- Plushify Arena schema

create table submissions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  image text not null,
  name text default 'Anonymous',
  wallet text,
  votes integer default 0,
  round_date date default current_date,
  winner boolean default false
);

-- Index for fast daily lookups
create index submissions_round_date_idx on submissions(round_date);
create index submissions_votes_idx on submissions(votes desc);

-- Storage bucket for plush images
insert into storage.buckets (id, name, public) values ('plushes', 'plushes', true);

-- RLS policies
alter table submissions enable row level security;

-- Anyone can read submissions
create policy "Public read" on submissions for select using (true);

-- Anyone can insert (wallet verified in app)
create policy "Public insert" on submissions for insert with check (true);

-- Only increment votes via function
create policy "Public update votes" on submissions for update using (true);

-- Helper function to increment votes safely
create or replace function increment_votes(row_id uuid)
returns void as $$
  update submissions set votes = votes + 1 where id = row_id;
$$ language sql security definer;
