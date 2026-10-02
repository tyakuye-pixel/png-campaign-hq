# Project Guidance

## User Preferences

- Coverage of all electorates in Papua New Guinea
- Public read-only browsing with admin-only editing
- Serious civic/government dashboard tone

## Verified Commands

- **typecheck**: `pnpm typecheck`
- **fix**: `pnpm fix`
- **build**: `pnpm build`

## Learnings

- Frontend uses TanStack Router with a pathless layout route (id 'layout'); child route ids are '/layout/electorates/$id' for useParams.
- Motoko timestamps are nanosecond bigints; convert with Number(ts / 1_000_000n) before Date use and BigInt(date.getTime()) * 1_000_000n for the reverse.
- Backend enums (SupportLevel, SeatType, ActivityType) are runtime values; import and re-export them as value exports, not type-only.
- Multi-key URL filter updates must go through a single batched setFilters patch; two setFilter calls in one handler overwrite each other via stale closure.
- Admin mutation forms should close only after a successful save (wasSaving ref plus !error) so failures keep the form open for retry.
- OQL entities for public read-only data use .public_() with .sample(...) to seed schema discovery.
- getApiDoc belongs in its own mixin file as a bare top-level mixin () block returning the Markdown literal directly.
