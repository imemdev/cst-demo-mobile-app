# Report screenshot coverage

`main.tex` currently includes `chapitre3.tex` and `chapitre4.tex`. Six mobile composites in those chapters contain 17 phone states. `phonepfe7.png` (no space) is a sequence diagram and is not an additional phone screen.

| # | Original report asset | Phone state | Recreated behavior |
|---|---|---|---|
| 1 | `images/chap3/1.png`, left | Empty login | Email/password inputs, validation, eye toggle |
| 2 | Same, right | Filled login | Editable values, loading, sign-in transition |
| 3 | `images/chap3/3.png`, left | User table | Local rows, expandable editing, pagination |
| 4 | Same, middle | User form | Text fields, role selection, active switch, Save |
| 5 | Same, right | Saved user | Updated table/count and success toast |
| 6 | `images/chap4/phone pfe5.png`, left | Company list | Search, add, edit, local delete/undo |
| 7 | Same, middle | Required company fields | Real validation and red inline messages |
| 8 | Same, right | Filled company form | Editable contact fields, establishment modal, Save |
| 9 | `images/chap4/phone pfe4.png`, left | Room list | Contact and sensor counts, editable details |
| 10 | Same, middle | Sensor dropdown | Selectable sensor checkboxes |
| 11 | Same, right | Contact dropdown | Selectable contact checkboxes |
| 12 | `images/chap4/phone pfe7.png`, left | Device table | Search, inspect, edit, local delete/undo |
| 13 | Same, middle | Device form | Identity validation and schematic location picker |
| 14 | Same, right | Nested sensor form | Units, gauge bounds, step, thresholds, multiple sensors |
| 15 | `images/chap5/phone pfe9.png`, left | Dashboard/map | Status toggles, site search, SVG zoom/pan/marker |
| 16 | Same, middle | Alerts | Type filters, Locate, sensor detail |
| 17 | Same, right | Gauge | SVG needle, numeric readout, settings and simulated readings |

## Intentional additions and limits

- Navigation, cancel controls, a new-user button, inspection dialogs, establishment entry, undo, and simulation controls complete the local demo where a static screenshot does not show a full workflow.
- Labels preserve the report's mixture of English and French. The UK flag indicates that source appearance; a complete translated interface is not implemented.
- Per presentation feedback, the outer phone uses a slimmer graphite/metal frame, a centered camera, a status bar and bottom navigation instead of the report's oversized notch. The display remains 400 × 870, with 54px/48px top/bottom safe areas and a scrollable 400 × 768 application viewport. The entire device scales together; dialogs and notifications stay inside the application viewport.
- The original app font, logo and photograph are reused. All UI surfaces—including the phone itself—are HTML/CSS/SVG. The map geography is schematic, so its roads are an approximation rather than an exact map-tile reproduction.
- Room details use a clear eye control instead of the overlapping eye/delete icons visible in the source. Form rows remain inside the phone rather than reproducing accidental horizontal clipping.
- This coverage has been checked against the report source and image contents. Pixel-level equivalence and full browser playback are not claimed.
