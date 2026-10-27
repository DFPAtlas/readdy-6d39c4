create or replace function public.enforce_review_trust_fields()
returns trigger language plpgsql security definer
set search_path = public, private, auth
as $function$
begin
  if auth.role() = 'service_role' or private.is_staff() then
    return new;
  end if;
  if tg_op = 'INSERT' then
    new.user_id := auth.uid();
    new.is_resident := false;
    new.verification_status := 'unverified';
    new.moderation_status := 'pending';
    new.helpful_count := 0;
  elsif tg_op = 'UPDATE' then
    new.user_id := old.user_id;
    new.council_id := old.council_id;
    new.is_resident := old.is_resident;
    new.verification_status := old.verification_status;
    new.district := old.district;
    new.created_at := old.created_at;
    new.status := old.status;
    new.moderation_status := old.moderation_status;
    -- Content changes always need another moderation decision.
    if row(new.title,new.body,new.rating,new.display_name,new.service_id,new.service_name,new.experience_date,new.resolved)
       is distinct from
       row(old.title,old.body,old.rating,old.display_name,old.service_id,old.service_name,old.experience_date,old.resolved) then
      new.moderation_status := 'pending';
    end if;
    -- Votes are the source of truth; direct API updates cannot inflate counts.
    select count(*)::integer into new.helpful_count from public.review_helpful_votes where review_id = old.id;
  end if;
  new.updated_at := now();
  return new;
end;
$function$;
