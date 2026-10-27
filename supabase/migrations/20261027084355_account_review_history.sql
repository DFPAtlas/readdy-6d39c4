-- Account history must include the signed-in author's pending reviews.
-- Public visibility still requires both status and moderation_status = live.
create policy "Authors read own reviews"
  on public.reviews for select to authenticated
  using ((select auth.uid()) = user_id);
