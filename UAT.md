# Rate Your Local Council — launch repair checks

## Completed automated checks

See the PR for results at its current commit. Coverage includes safe same-site redirects, query routes for councils outside the old static list, legacy service aliases, draft validation/expiry, lint, TypeScript and production export.

## Browser checks before publication

- [ ] At 390px, 768px and 1366px there is no horizontal page overflow; cookie/storage notice does not hide controls after dismissal.
- [ ] Keyboard navigation reaches menus, links and form controls with visible focus.
- [ ] Any council record in the directory opens via `/council-view?council=…`, including Barnet (outside the original static list).
- [ ] Service directory → choose council → service reviews → write review retains the selected service.
- [ ] Old `/service/westminster/planning/reviews` loads the shared service page instead of a hardcoded not-found screen.
- [ ] Unknown council/service and failed requests show useful error states.
- [ ] Postcode page provides explicit GOV.UK guidance and never fabricates matches or review counts.
- [ ] Every Hertfordshire guide anchor reaches a real section; source links resolve.
- [ ] Signed-out review draft survives login, signup/confirmation and refresh; expired/corrupt drafts are not restored.
- [ ] Submit with a confirmed email → pending moderation → appears in the author's account → not publicly visible until approval.
- [ ] Another user cannot read/delete pending reviews belonging to the author.
- [ ] Delete own review removes exactly that review and reports failure honestly.
- [ ] Account profile saves; sign out works; request account deletion explains the manual process and does not claim deletion.
- [ ] Password reset email returns to `/reset-password`, changes the password and permits a fresh sign-in; expired links are handled.
- [ ] Report review opens monitored contact details; verify delivery and handling with the final support mailbox.
- [ ] Check final privacy/terms with the actual operator, domain, providers and operational procedures.

## Known outstanding work

Automatic postcode lookup, residency verification UI, moderation operations, automatic account closure/retention, direct review editing and official data feeds are not delivered by this batch. Contact mailbox, final domain, mail delivery and production auth redirects need verification before launch.
