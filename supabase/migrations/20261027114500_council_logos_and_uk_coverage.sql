-- Council emblems, nation and UK-wide authority types.
-- Adds nullable columns only; existing reads are unaffected.

alter table public.councils
  add column if not exists nation text,
  add column if not exists logo_url text,
  add column if not exists logo_type text,
  add column if not exists logo_source_url text;

alter table public.councils
  drop constraint if exists councils_nation_check,
  add constraint councils_nation_check
    check (nation is null or nation in ('England', 'Scotland', 'Wales', 'Northern Ireland'));

alter table public.councils
  drop constraint if exists councils_logo_type_check,
  add constraint councils_logo_type_check
    check (logo_type is null or logo_type in ('logo', 'coat_of_arms'));

-- Emblems are only taken from Wikimedia Commons so every image has a licence page.
alter table public.councils
  drop constraint if exists councils_logo_url_check,
  add constraint councils_logo_url_check
    check (logo_url is null or logo_url like 'https://commons.wikimedia.org/wiki/Special:FilePath/%');

alter table public.councils
  drop constraint if exists councils_logo_complete_check,
  add constraint councils_logo_complete_check
    check ((logo_url is null) = (logo_type is null) and (logo_url is null) = (logo_source_url is null));

comment on column public.councils.nation is 'UK nation the authority serves.';
comment on column public.councils.logo_url is 'Wikimedia Commons Special:FilePath URL for the council logo or coat of arms.';
comment on column public.councils.logo_type is 'logo or coat_of_arms.';
comment on column public.councils.logo_source_url is 'Commons file page holding the image licence and author.';
