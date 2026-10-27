# Rate Your Local Council

Next.js App Router site exported as static HTML for Readdy hosting. Public pages read council records and approved resident reviews from Supabase; authentication and submissions use the browser client with database RLS.

## Local setup

Use Node 20 or later. Run `npm ci`, copy `.env.example` to `.env.local` and provide the project's public URL and anon/publishable key. Never add a service-role key to a `NEXT_PUBLIC_` variable. Run `npm run dev`.

## Validation

- `npm test`: navigation, safe return paths, draft expiry and legacy service aliases.
- `npm run lint`: ESLint.
- `npm run typecheck`: TypeScript.
- `npm run build`: production static export into `out/`.
- `npx playwright install chromium` then `npm run test:browser`: 21 exported page states at 390/768/1366px, menu and rating keyboard controls, guide anchors and draft recovery/expiry. Run against an unconfigured build; external requests are blocked so this suite does not send email or touch production data.

CI runs tests, lint and the production build with placeholder configuration. It does not prove production credentials, emails or moderation work.

## Static routes

Council data can change without rebuilding the exported route list. Navigation therefore uses:

- `/council-view?council=<slug>`
- `/council-service?council=<slug>&service=<slug>`
- `/write-review?council=<slug>&service=<slug>`

The original path-based council/service/review URLs remain as compatibility entry points. `/council/hertfordshire` is an official-source resource guide; resident reviews use `/council-view?council=hertfordshire`.

## Backend change

`supabase/migrations/20261027084355_account_review_history.sql` adds author-only visibility of their own pending reviews, without changing public visibility. It was applied to the existing Rate your local Council project and verified with temporary, rolled-back fixtures: owner can read; other user and anonymous cannot. The second migration, `20261027102317_remoderate_author_review_edits.sql`, returns author-edited content to pending moderation and prevents direct vote-count and trust-field manipulation. Rolled-back role tests verified edited content is no longer public and authors cannot self-verify or inflate helpful counts. Both migrations were applied; security advisors returned no findings. These are incremental migrations for the existing database, not a complete schema bootstrap.

`20261027114500_council_logos_and_uk_coverage.sql` adds `nation`, `logo_url`, `logo_type` and `logo_source_url` to `councils` (emblems restricted to Wikimedia Commons file paths). `20261027114600_load_uk_councils.sql` upserts all 382 current UK principal councils from mySociety's local authority register and Wikidata (websites, logos and coats of arms), keeping existing council ids and names. Both were applied on 27 Oct 2026. Councils without a held emblem show an initials badge; 133 currently have a logo or coat of arms.

## Deployment and remaining launch gates

Merge/publish only after reviewing the PR. Readdy must retain `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`; auth confirmation/magic-link redirects must allow the published site, and password recovery must allow `/reset-password`.

Still required before launch:

1. Confirm the final domain and a monitored support mailbox. The existing `hello@localverdict.co.uk` address remains pending verification; account closure and reports currently use this manual channel.
2. Postcode matching is live via the `postcode-lookup` edge function (see below). Before launch, confirm the privacy notice wording about postcodes.io with whoever approves the legal copy.
3. Verify public auth settings, mail delivery, confirmation and password recovery on the published domain.
4. Confirm a staffed moderation workflow, residency-verification process and secure account-deletion/retention procedure. No automatic account deletion or direct review editing is claimed.
5. Complete the privacy notice with verified controller address, legal bases, processors/transfers, retention schedule and complaint details. Current copy describes implemented storage/behaviour; it is not a complete legal approval.
6. Test desktop/mobile layouts and full browser journeys with production configuration. A static build alone is insufficient.

Official data feeds, local activity feeds and a full civic dashboard remain planned. The resource guide supplies source links rather than simulated live data or fabricated ratings.

## Postcode lookup

`/search?postcode=…` calls the `postcode-lookup` Supabase edge function (`supabase/functions/postcode-lookup`). The function asks [postcodes.io](https://postcodes.io) (ONS postcode data) for the postcode's district and county GSS codes, then matches them to `councils.official_code`. Two-tier areas return the county and the district; everywhere else returns one council. Terminated postcodes resolve to the nearest live postcode. The browser never contacts postcodes.io, postcodes are not stored or logged, and each function instance limits a caller to 30 lookups a minute. If the function cannot match, the page falls back to the GOV.UK lookup.

Deploy changes with `supabase functions deploy postcode-lookup` (JWT verification on; the site calls it with the public anon key). Shared logic lives in `logic.ts` and is unit-tested by `tests/postcode.test.ts`; `index.ts` is Deno-only and excluded from the site's TypeScript build.
