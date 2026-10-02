# Design Brief

## Direction

The Red House Ledger — a serious civic intelligence briefing for tracking every PNG electorate, built for scanability over decoration.

## Tone

Authoritative, calm, high-contrast government-analytics: dense readable tables and charts, restrained palette, no gradients or ornament.

## Differentiation

A deep national crimson "ledger rule" — a 2px accent bar that tops every KPI card and section header — ties the dashboard to the PNG flag while keeping the surface cool, neutral, and trustworthy.

## Color Palette

| Token      | OKLCH         | Role                                          |
| ---------- | ------------- | --------------------------------------------- |
| background | 0.975 0.004 250 | Cool slate paper canvas                     |
| foreground | 0.19 0.02 255   | Ink text                                    |
| card       | 1.0 0.001 250   | White data surfaces                         |
| primary    | 0.42 0.17 18    | Deep national crimson — CTAs, active nav, rules |
| accent     | 0.72 0.14 78    | Warm gold — highlights, focus, secondary data |
| muted      | 0.955 0.006 250 | Table stripes, inactive chips, metadata     |

## Typography

- Display: Space Grotesk — page titles, section headings, KPI numbers
- Body: Figtree — labels, table cells, prose, nav
- Mono: JetBrains Mono — tabular voter counts, IDs, timestamps
- Scale: hero `text-3xl md:text-4xl font-bold tracking-tight`, h2 `text-xl font-semibold tracking-tight`, label `label-caps` (xs uppercase tracking-[0.14em]), body `text-sm md:text-base`

## Elevation & Depth

Flat, layered surfaces: white cards on slate canvas with 1px `border-border` and `shadow-subtle`; `shadow-elevated` only for popovers/dropdowns; no glow.

## Structural Zones

| Zone    | Background          | Border          | Notes                                                       |
| ------- | ------------------- | --------------- | ----------------------------------------------------------- |
| Header  | `bg-sidebar`        | `border-b`      | App shell top bar, brand mark + global search + admin state |
| Sidebar | `bg-sidebar`        | `border-r`      | Fixed nav: National Overview, Electorate Directory, Activity |
| Content | `bg-background`     | —               | Cards on canvas; alternate `bg-muted/30` for section bands  |
| Footer  | `bg-muted/40`       | `border-t`      | Compact source/attribution strip                            |

## Spacing & Rhythm

Section gaps `space-y-6 md:space-y-8`; card padding `p-4 md:p-6`; table rows `py-2.5`; micro-spacing on chips `px-2.5 py-0.5`; tight 4px base grid.

## Component Patterns

- Buttons: `rounded-md`, primary crimson fill with white text; ghost/secondary outline for filters; hover darkens one L step
- Cards: `rounded-lg border bg-card shadow-subtle`, optional `border-t-2 border-primary` ledger rule
- Badges: pill `rounded-full` support chips — tinted `bg-*/15` with same-hue darker text; outline variant for region/province tags

## Motion

- Entrance: `animate-fade-up` staggered on KPI cards and table rows (0.35s, ease-out)
- Hover: `transition-smooth` on rows/buttons — background tint + border-color shift, 0.3s
- Decorative: `animate-grow-x` on stacked-bar segments and progress meters; no looping motion

## Constraints

- Support levels always carry a text label, never color alone (accessible in light + dark)
- Public read-only surfaces must never render admin edit controls
- Charts and tables use only `chart-*` / `support-*` semantic tokens, no raw colors
- Do not design for voter-roll import, demographics, or sentiment trends (out of scope)

## Signature Detail

The "ledger rule" — a thin deep-crimson bar capping every KPI card and section header — turns each panel into a stamped civic record and is the dashboard's single memorable motif.
