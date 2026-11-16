# Frontend Decisions

Three decisions, one for each problem found on the reference websites.
_(Replace the bracketed reference-site details with what you actually observed.)_

---

## Decision 1 – Keep search and filters when moving between list and details  *(interaction / state)*

| Field | Content |
|---|---|
| **Problem** | On [reference site], after filtering the timetable and opening a class, pressing Back returned to the unfiltered list, so the user had to search and filter again. |
| **Decision** | Store search, filters and sort in the URL query string (`/classes?q=yoga&level=Beginner`) using `useSearchParams`. The class link passes the current query in route state, so "Back to classes" and the browser Back button both return to the same filtered list. Classes in the plan stay saved even when filters hide them, and the results line says how many are hidden. |
| **Alternative** | Keep filters in React Context state. |
| **Reason** | The URL survives Back/Forward, refresh and sharing a link, which Context state does not (lost on refresh). Customers comparing classes over several days can return to their exact search. |
| **Tradeoff** | URLs are longer, and values from the URL must be validated (`filtersFromParams` ignores unknown values) because users can edit them. Search updates use `replace` so typing doesn't fill the history. |
| **Code location** | `src/pages/ClassListPage.jsx` (`updateFilter`, `hiddenPlanned`); `src/utils/classHelpers.js` (`filtersFromParams`, `filtersToParams`); `src/components/ClassCard.jsx` (`state={{ fromSearch }}`); `src/pages/ClassDetailsPage.jsx` (`backTo`) |
| **Evidence** | 1. Open `/classes`, search "yoga", set Level = Beginner. 2. Open a class. 3. Press Back. → The list still shows 2 results with the same search and filter. _(screenshots)_ |

---

## Decision 2 – Show availability, level and price on every listing card  *(information hierarchy)*

| Field | Content |
|---|---|
| **Problem** | On [reference site], the class list showed only the class name and time. Seats left, level requirements and price appeared only after opening the class or starting the booking, so users spent time on classes they could not book. |
| **Decision** | Each card shows, in order: level badge + seat badge ("Only 2 seats left", "Full – no seats left"), title, day/time/duration/instructor, an experience warning for Advanced classes, then price and the primary action. Full classes are greyed out with a disabled "Full" button, and a "Hide full classes" filter is available. Status always uses text as well as colour. |
| **Alternative** | Keep cards minimal and show availability only on the details page. |
| **Reason** | Customers can compare and rule out classes from the list itself, and fewer people reach checkout and then abandon it because a class is full or unsuitable. |
| **Tradeoff** | Cards are denser and taller, especially on mobile; badges had to be kept short to stay readable. |
| **Code location** | `src/components/ClassCard.jsx`; `src/components/Badges.jsx` (`AvailabilityBadge`, `LevelBadge`); `src/styles/global.css` (`.class-card`, `.badge--*`) |
| **Evidence** | Open `/classes` at 390 px and 1280 px: "Power Pilates Core" shows "Full – no seats left" with a disabled button; Advanced classes show the experience note. _(screenshots)_ |

---

## Decision 3 – Specific inline form errors that never clear valid input  *(interaction / form state)*

| Field | Content |
|---|---|
| **Problem** | On [reference site], submitting the booking form with one invalid field showed a generic error at the top and cleared other fields, so the user had to retype everything. |
| **Decision** | The form is fully controlled. Each field shows its own message after the user leaves it or submits ("Use the format 03XX-XXXXXXX"). A blocked submit shows an error summary with links to each field and moves focus to it. Values are never reset on error. The draft is kept in `PlanContext` (memory only), so going back to the plan to remove an ineligible class keeps the form filled in. |
| **Alternative** | Use native browser validation (`required`, `pattern`) and its default pop-up messages. |
| **Reason** | Clear messages and preserved input reduce rework and abandoned bookings. Native pop-ups can't explain studio rules (member ID format, experience vs. Advanced classes) and look different in each browser. |
| **Tradeoff** | More code (touched/submitted state, error summary). Keeping the draft only in memory means it is lost on refresh; this was chosen deliberately so personal details are not written to localStorage. |
| **Code location** | `src/pages/CheckoutPage.jsx` (`handleSubmit`, `handleBlur`, `showError`); `src/rules/bookingValidation.js` (`validateBookingForm`); `src/components/FormField.jsx`; `src/context/PlanContext.jsx` (`draft`, `updateDraft`) |
| **Evidence** | 1. Add a class, go to `/checkout`. 2. Type a valid name and phone `0300-12`, then submit. → Focus moves to the error summary, the name is kept, and the phone shows a format message. _(screenshots)_ |
