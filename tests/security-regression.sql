-- Run with a database owner connection. Every fixture and change is rolled back.
-- A failing assertion aborts the transaction; issue ROLLBACK before retrying.
begin;
select set_config('request.jwt.claims', '{"role":"service_role"}', true);
select set_config('test.author', gen_random_uuid()::text, true),
       set_config('test.other', gen_random_uuid()::text, true);
insert into auth.users(id,email) values
  (current_setting('test.author')::uuid, 'policy-' || current_setting('test.author') || '@example.invalid'),
  (current_setting('test.other')::uuid, 'policy-' || current_setting('test.other') || '@example.invalid');
insert into public.reviews(council_id,user_id,title,body,rating,moderation_status)
select id,current_setting('test.author')::uuid,'Policy regression fixture',
       'Temporary regression fixture, always rolled back.',4,'pending'
from public.councils limit 1;
select set_config('request.jwt.claims',jsonb_build_object('role','authenticated','sub',current_setting('test.author'))::text,true);
set local role authenticated;
do $$ begin
  if (select count(*) from public.reviews where user_id=current_setting('test.author')::uuid) <> 1 then
    raise exception 'Author cannot read own pending review';
  end if;
end $$;
reset role;
select set_config('request.jwt.claims',jsonb_build_object('role','authenticated','sub',current_setting('test.other'))::text,true);
set local role authenticated;
do $$ declare affected integer; begin
  if exists(select 1 from public.reviews where user_id=current_setting('test.author')::uuid) then
    raise exception 'Other user can read pending review';
  end if;
  delete from public.reviews where user_id=current_setting('test.author')::uuid;
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'Other user can delete review'; end if;
end $$;
reset role;
select set_config('request.jwt.claims','{"role":"service_role"}',true);
update public.reviews set moderation_status='live' where user_id=current_setting('test.author')::uuid;
select set_config('request.jwt.claims',jsonb_build_object('role','authenticated','sub',current_setting('test.author'))::text,true);
set local role authenticated;
update public.reviews
set title='Edited policy fixture', moderation_status='live', is_resident=true,
    verification_status='verified', helpful_count=999
where user_id=current_setting('test.author')::uuid;
do $$ begin
  if not exists(select 1 from public.reviews where user_id=current_setting('test.author')::uuid
    and moderation_status='pending' and not is_resident
    and verification_status='unverified' and helpful_count=0) then
    raise exception 'Trust field protection or remoderation failed';
  end if;
end $$;
reset role;
select set_config('request.jwt.claims','{"role":"anon"}',true);
set local role anon;
do $$ begin
  if exists(select 1 from public.reviews where user_id=current_setting('test.author')::uuid) then
    raise exception 'Anonymous can read remoderation-pending review';
  end if;
end $$;
reset role;
select set_config('request.jwt.claims',jsonb_build_object('role','authenticated','sub',current_setting('test.author'))::text,true);
set local role authenticated;
do $$ declare affected integer; begin
  delete from public.reviews where user_id=current_setting('test.author')::uuid;
  get diagnostics affected = row_count;
  if affected <> 1 then raise exception 'Author cannot delete own pending review'; end if;
end $$;
reset role;
rollback;
select 'PASS: owner visibility/deletion, isolation, remoderation, trust fields and vote counts; fixtures rolled back' as result;
