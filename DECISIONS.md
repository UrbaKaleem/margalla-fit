# Frontend Decisions

One decision for each problem observed on the reference website:
University of Warwick class timetable – https://warwick.ac.uk/services/teamwarwick/activities/classes/timetable/ (reviewed 16 November 2026).

Decision 1 concerns **interaction/state**. Decision 2 concerns **mobile layout / information hierarchy**.

---

## Decision 1 – Search, filters and sorting kept in the URL  *(interaction / state)*

| Field | Content |
|---|---|
| **Problem** | The reference timetable lists 100+ weekly classes in separate day sections with no search, filter or sort, so users must scan every day to find a class of a particular type or level. |
| **Decision** | One list for the whole week with a search box (title, type, instructor, level, description), Type/Level/Day filters, "Hide full classes" and four sort orders, all working together. The values are stored in the URL query (e.g. `/classes?q=yoga&level=Beginner`), so Back/Forward, refresh and a shared link keep them. A count shows how many results match and how many planned classes are hidden by the filters. |
| **Alternative** | Keep a day-by-day timetable and let users scan manually (or keep filters only in component state). |
| **Reason** | Students looking for, say, a beginner evening class can narrow 12 classes (or 100+) in one step. Keeping filters in the URL means opening a class and pressing Back doesn't lose the search. |
| **Tradeoff** | More controls to design and test. URL values can be edited by hand, so they must be validated (`filtersFromParams` ignores unknown values). |
| **Code location** | `src/pages/ClassListPage.jsx` – `updateFilter`, `resetFilters`, `hiddenPlanned`; `src/components/FilterBar.jsx`; `src/utils/classHelpers.js` – `filterAndSortClasses`, `filtersFromParams`, `filtersToParams` |
| **Evidence** | 1. Open `/classes`. 2. Type "yoga" and choose Level = Beginner → 2 results, URL `/classes?q=yoga&level=Beginner`. 3. Open a class, then press Back → same 2 results, search box still "yoga". _(screenshots: before/after)_ |

---

## Decision 2 – Responsive class cards instead of a wide table  *(mobile layout / information hierarchy)*

| Field | Content |
|---|---|
| **Problem** | The reference timetable is a wide table; the page itself tells small-screen users to swipe horizontally or use Shift + Mouse Wheel to see all columns. |
| **Decision** | Each class is a card in a grid that reflows to one column at phone width. Each card shows, top to bottom: level and seats-left badges (text + colour), title, day/time/duration/instructor, experience note for Advanced classes, then price next to the primary "Add to plan" button. On phones the extra filters collapse behind a "Filters" button, and a sticky bar shows the plan total and "View plan". |
| **Alternative** | Keep the table layout and rely on horizontal scrolling at small widths. |
| **Reason** | At 390 px everything needed to choose and act on a class is visible without sideways scrolling, and full classes are recognisable before tapping. |
| **Tradeoff** | Cards take more vertical space than table rows, so the list is longer to scroll; the sticky plan bar was added to keep the next step reachable. |
| **Code location** | `src/components/ClassCard.jsx`; `src/components/Badges.jsx`; `src/components/PlanBar.jsx`; `src/styles/global.css` – `.class-grid`, `.class-card`, `@media (max-width: 640px)` rules (`.filter-bar__fields`, `.plan-bar`) |
| **Evidence** | Open `/classes` in DevTools device mode at 390 px: one column of cards, no horizontal scrollbar, "Filters" button expands the filters, plan bar appears after adding a class. Compare with 1280 px (four columns). _(screenshots at both widths)_ |

---

## Decision 3 – A connected booking journey inside the app  *(interaction / state)*

| Field | Content |
|---|---|
| **Problem** | On the reference site, browsing and booking are separate: "Book a class" opens a different booking service in a new window, so the user leaves the timetable they were reading. |
| **Decision** | Listing → details → weekly plan → booking form → summary → confirmation all run in one React app with shared state (`ClassesContext`, `PlanContext`). The plan is saved in localStorage and re-checked against current availability. The three operating rules are applied before confirmation. |
| **Alternative** | Link out to a separate booking service from each class, as the reference site does. |
| **Reason** | The user keeps their context (selected classes, people per session, running total) from discovery to confirmation. Problems such as a full class or an ineligible Advanced class are explained at the point where they can be fixed. |
| **Tradeoff** | More shared state and validation logic to maintain in the frontend. Because there is no server, bookings are simulated and seat counts are not actually reduced. |
| **Code location** | `src/context/PlanContext.jsx` – `addToPlan`, `updateAttendees`, `removeFromPlan`; `src/hooks/usePlanLines.js`; `src/utils/planHelpers.js` – `getPlanLines`; `src/pages/CheckoutPage.jsx` – `handleSubmit`; `src/rules/bookingRules.js`; `src/pages/ConfirmationPage.jsx` |
| **Evidence** | 1. Add Boxing Basics (2 people) from its details page. 2. Open My plan → estimated total shown. 3. Continue → fill the form → Confirm → confirmation page shows reference, sessions and total. _(screenshots of each step)_ |