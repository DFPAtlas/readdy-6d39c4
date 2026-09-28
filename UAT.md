# Rate Your Local Council — UAT Handoff

## Scope of this build

This GitHub build is the production-shaped concept handoff for Readdy. It establishes the information architecture and visual system before live Supabase/API integrations are connected.

### Core routes to test

1. `/` — rebuilt product homepage
2. `/council/hertfordshire` — full civic intelligence dashboard concept
3. `/councils` — existing council directory
4. `/council/westminster` — existing council/review flow for regression testing
5. `/login` and `/account` — existing account concept flows
6. `/legal/*` — existing policy pages

## Data labelling rules

- **Resident opinion** must never be presented as official council performance data.
- **Official data** must display a source and, once live, a snapshot/update date.
- **Context data** such as crime or rail information must state when the responsible body is not the council.
- Political parties, councillors, candidates and mayors are not platform-ranked or scored. Representation pages should show factual sourced records only.
- Demo/placeholder resident ratings must remain labelled as concept data until Supabase review data is live.

## Hertfordshire verified concept facts

- ONS 2024 population: 1,236,191.
- ONS 2024 median age: 40.
- Current lower-tier structure: 10 district/borough councils.
- Hertfordshire has 124 parish/town councils.
- HCC states it spends more than £1.2bn a year delivering 500+ services.
- HCC's 2026/27 county council tax element increased by 4.99% (2% adult social care precept + 2.99% general council tax).
- Government announced on 16 July 2026 that Hertfordshire will move to four unitary councils, subject to Parliamentary approval.
- Shadow-authority elections are expected in May 2027 and vesting is planned for 1 April 2028.

## UAT checklist

### Visual / responsive
- [ ] Homepage renders at 1920×1080 with no horizontal overflow.
- [ ] Homepage remains usable at 1366×768.
- [ ] Mobile layout works at 390px width.
- [ ] Hertfordshire dashboard cards stack cleanly on tablet and mobile.
- [ ] Sticky global header does not obscure content.
- [ ] Dashboard sidebar remains usable and does not overlap content.

### Navigation
- [ ] Logo returns to `/`.
- [ ] `Explore Hertfordshire dashboard` opens `/council/hertfordshire`.
- [ ] Header Data link opens the Hertfordshire dashboard.
- [ ] Councils, About, Help, Login and review links resolve.
- [ ] External official-source links open in a new tab.

### Content integrity
- [ ] Resident rating is visibly labelled as resident opinion / concept score.
- [ ] Official data cards are visibly labelled official data.
- [ ] Crime section explicitly says it is not a council performance score.
- [ ] Politics & Representation section contains no platform-generated political rating.
- [ ] Reorganisation timeline states that implementation is subject to Parliamentary approval.

### Accessibility
- [ ] Keyboard navigation reaches primary nav, CTAs and dashboard source links.
- [ ] Focus states are visible.
- [ ] Text contrast is readable on hero imagery.
- [ ] Heading order remains logical.
- [ ] Interactive controls have usable text/ARIA labels.

### Regression
- [ ] Existing `/councils` page still renders.
- [ ] Existing dynamic council pages still render.
- [ ] Existing review form still renders.
- [ ] Existing legal pages still render.

## Next production phase after Readdy pull

1. Apply final visual polish in Readdy.
2. Create the canonical council/authority data model using official authority codes.
3. Connect postcode-to-authority lookup.
4. Connect Supabase auth, reviews, verification and moderation.
5. Add scheduled public-data ingestion with source timestamps and caching.
6. Build council / county / district / parish relationships.
7. Add meetings, consultations, projects and spending feeds.
8. Run full UAT again against live integrations before launch.
