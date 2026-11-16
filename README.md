# Margalla Fit – Class Booking Website (React)

**CS4032 Web Programming – Assignment 02 (Fall 2026)**

| | |
|---|---|
| Student | _Your Name_ |
| Roll number | _24I-XXXX_ |
| Section | _X_ |
| GitHub | _https://github.com/your-username/margalla-fit_ |
| Live site | _https://margalla-fit.vercel.app_ |

## Project description

Margalla Fit is a **fictional** small-group fitness studio in F-7 Markaz, Islamabad, aimed at university
students and young professionals. The website lets a customer browse this week's 12 classes, search and
filter them, open a class's details, build a weekly plan (bringing up to 2 friends), enter booking details,
review a calculated total and receive a booking confirmation.

All data is local and **all bookings are simulated** – nothing is sent to a server and no payment is taken.

## Commands

```bash
npm install        # install dependencies
npm run dev        # start the development server (http://localhost:5173)
npm run build      # production build into dist/
npm run preview    # serve the production build locally
npm test           # run the business-rule tests (node --test)
```

Requires Node.js 20 or newer.

## Routes

| Route | Purpose |
|---|---|
| `/` | Home: studio intro, quick links to class types, how booking works |
| `/classes` | Timetable with search, filters (type, level, day, hide full) and sort. Filters are stored in the URL query, e.g. `/classes?q=yoga&level=Beginner` |
| `/classes/:id` | Class details, eligibility notice, people selector, add/update/remove from plan. Unknown ids show a "Class not found" message |
| `/plan` | Weekly plan: change people, remove, fix conflicts, estimated total |
| `/checkout` | Booking form (name, mobile, email, membership, member ID, experience, agreement) + summary |
| `/confirmation` | Booking reference and final summary (survives refresh) |
| `*` | Page not found |

## Feature summary

- Async mock loader (`loadClasses`) with loading, error and **retry** states
- Search across title, type, instructor, level and description; filters and sort combine with search
- Seats left, level, price and eligibility visible on every card (no need to open details to compare)
- Weekly plan stored in **localStorage** and re-checked against the current timetable when restored
- Controlled form with 7 validation rules, inline messages, an error summary that receives focus, and
  valid input preserved (the draft also survives going back to the plan page)
- Three operating rules (below) that block invalid bookings
- Responsive layout tested at 390 px and 1280 px; keyboard accessible with visible focus

## Operating rules

| Rule | Condition | Where communicated | Behaviour | Boundary case |
|---|---|---|---|---|
| 1. Capacity | 1–3 people per session, and never more than the seats left | Beside the people selector (details page and plan); seat badges on cards | `+` button disabled at the limit; over-limit plan lines show an error and a "Reduce to N" fix; checkout blocked | 3 people → accepted; 4 → rejected. 2 people when 2 seats left → accepted |
| 2. Eligibility | Advanced classes need Intermediate or Advanced experience | "Requires 6+ months' training" on cards; warning on details page; hint under the experience field | Choosing *Beginner* with an Advanced class in the plan shows a warning listing those classes with "Remove from plan"; confirmation blocked | *Intermediate* + Advanced class → allowed |
| 3. Pricing | Members: 20% off, no fee. Drop-in: Rs 300 booking fee, waived when subtotal ≥ Rs 6,000 | Membership options in the form; summary shows fee and "add Rs X more to waive it" | Summary recalculates instantly | Drop-in subtotal Rs 6,000 exactly → fee waived; Rs 5,999 → fee Rs 300 |

Rules live in `src/rules/bookingRules.js` (pure functions used by both the app and the tests).

## Business-rule test

`tests/bookingRules.test.js` tests **Rule 1** (`checkAttendees`) with Node's built-in runner
(`node:test` + `node:assert/strict`): a valid quantity (2), exactly the limit (3), above the limit (4),
plus seats-left, full-session and zero cases.

```bash
npm test
# tests 7 · pass 7 · fail 0
```

## Reproducing edge cases

Open **"Demo controls (for testing edge cases)"** at the bottom of any page. Settings are saved in
localStorage, so they also apply after a refresh. Untick them to return to normal.

| Edge case | How to reproduce | Expected result |
|---|---|---|
| Loading failure | Tick *Simulate loading failure* | Error message + **Try again** button; untick and press Try again to recover |
| Empty dataset | Tick *Simulate empty timetable* and open `/classes` | "No classes are published yet" (different from no matches) |
| No matches | Search `zzzz` on `/classes` | "No classes match your search" + **Clear search and filters** |
| Invalid URL | Open `/classes/not-a-class` or `/anything` | "Class not found" / "Page not found" with a link to the classes |
| Restored plan now invalid | Add *Sunrise Vinyasa Yoga*, *Spin Sprint* and *Saturday Burn HIIT* (3 people). Tick *Simulate changed availability*, open `/plan` (or refresh) | Three highlighted conflicts: full, cancelled, only 1 seat left (with "Reduce to 1 person"). Continue is blocked until fixed |
| Invalid form input | On `/checkout` enter phone `0300-12` and submit | Specific messages, focus moves to the error summary, valid fields keep their values |
| Missing image / long text | Open *Evening Yin & Stretch* | Patterned fallback with "No photo available" label; long description wraps without overflow |
| Corrupted storage | In DevTools set `mf-plan-v1` to `oops` and refresh | Plan resets to empty instead of crashing |

## Simulated operations and known limitations

- Bookings, member IDs and payments are simulated. Any `MF-` + 4 digits is accepted as a member ID.
- Seat counts are not reduced after you book (there is no shared server).
- Classes repeat weekly; there are no real calendar dates or booking cut-off times.
- Form details are kept in memory only (not localStorage), so they are cleared if the page is refreshed.

## Deployment

The site is a single-page app. Rewrites send every path to `index.html`, so refreshing a nested route
such as `/classes/boxing-basics` works:

- Vercel: `vercel.json`
- Netlify: `public/_redirects`

## Concept map

| Concept | File | Component / function |
|---|---|---|
| Components, modules, imports/exports | `src/components/*`, `src/pages/*` | e.g. `ClassCard`, `PlanPage` |
| Props | `src/components/ClassCard.jsx` | `record`, `planItem` props |
| Callback props | `ClassCard.jsx`, `PlanLine.jsx`, `FilterBar.jsx` | `onAdd`, `onRemove`, `onChangeAttendees`, `onChange` |
| Events / preventDefault | `src/pages/CheckoutPage.jsx`, `FilterBar.jsx` | `handleSubmit` |
| useState + controlled inputs | `CheckoutPage.jsx`, `FilterBar.jsx` | form fields bound to `draft` |
| Functional updates | `src/context/PlanContext.jsx` | `setItems((prev) => …)` |
| Immutable object updates | `PlanContext.jsx` | `updateDraft` (`{ ...prev, [name]: value }`) |
| Immutable array updates | `PlanContext.jsx` | `addToPlan` (spread/map), `removeFromPlan` (filter) |
| Lists and keys | `ClassListPage.jsx`, `PlanPage.jsx` | `key={record.id}` |
| Conditional rendering | `LoadGate.jsx`, `SelectionPanel.jsx`, `PlanLine.jsx` | loading / error / full / issue states |
| Shared state (Context) | `ClassesContext.jsx`, `PlanContext.jsx` | `useClasses`, `usePlan` |
| Derived values | `src/rules/bookingRules.js`, `src/hooks/usePlanLines.js` | `calculateSummary`, `getPlanLines` |
| useEffect + dependencies + cleanup | `ClassesContext.jsx` | load effect with `ignore` flag, deps `[reloadKey, demo]` |
| useEffect cleanup (listener) | `PlanContext.jsx` | `storage` event listener removed on unmount |
| Async code + failure handling | `src/services/mockLoader.js`, `CheckoutPage.jsx` | `loadClasses`, `submitBooking`, `try/catch` |
| localStorage | `PlanContext.jsx`, `src/services/demoSettings.js` | `readSavedPlan`, `readDemoSettings` |
| Routing, URL params, links | `App.jsx`, `ClassDetailsPage.jsx`, `ClassListPage.jsx` | `useParams`, `useSearchParams`, `Link`, `useNavigate` |
| Array methods, destructuring | `src/utils/classHelpers.js` | `filterAndSortClasses` |
| Business rules + tests | `src/rules/bookingRules.js`, `tests/bookingRules.test.js` | `checkAttendees` |

## Folder structure

```
src/
  assets/classes/   original SVG illustrations
  components/       reusable UI (cards, filters, stepper, summary, layout…)
  context/          ClassesContext (data + loading), PlanContext (plan + form draft)
  data/             classes.js – 12 class records
  hooks/            usePlanLines – derived plan data
  pages/            one component per route
  rules/            bookingRules.js, bookingValidation.js
  services/         mockLoader.js, demoSettings.js
  styles/           global.css (authored, no UI kit)
  utils/            classHelpers.js, planHelpers.js
tests/              bookingRules.test.js
```

Illustrations were drawn for this project as SVG. No templates or UI component kits are used.
