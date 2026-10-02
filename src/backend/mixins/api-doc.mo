mixin () {
  public query func getApiDoc() : async Text {
    "# PNG Political Campaign Dashboard — Backend API

## Purpose

This canister backs a political campaign dashboard covering all electorates in
Papua New Guinea. It stores one record per electorate (name, province, region,
seat type, registered voter count, support level, campaign manager, notes) and
an append-only log of campaign activities (events, contacts, notes) recorded
against electorates. Public visitors browse read-only; signed-in administrators
edit campaign details and add activity entries.

## Public methods

### Reads (query, no authentication required)

- `listElectorates() : [Electorate]` — every tracked electorate.
- `getElectorate(id : ElectorateId) : ?Electorate` — one electorate by id, or
  `null` when no electorate has that id.
- `listActivities(electorateId : ElectorateId) : [CampaignActivity]` — all
  activities recorded against one electorate. Returns an empty array for an
  unknown electorate id (it does not distinguish unknown from empty).
- `getNationalSummary() : NationalSummary` — national totals: electorates
  tracked, distinct provinces, total registered voters, total activities, plus
  counts grouped by province and by support level.
- `listRecentActivities(limit : Nat) : [CampaignActivity]` — the most recently
  created activities across all electorates, newest first, capped at `limit`.
  A `limit` of `0` returns an empty array; a `limit` larger than the number of
  activities returns all of them.

### Mutations (update, admin only)

- `updateCampaignDetails(id : ElectorateId, details : UpdateCampaignDetails) : ?Electorate`
  — replaces the electorate's support level, campaign manager, and notes, and
  refreshes `updatedAt`. Returns the updated electorate, or `null` when no
  electorate has that id. Traps for a non-admin caller.
- `addActivity(electorateId : ElectorateId, input : NewActivity) : ?CampaignActivity`
  — appends an activity to the electorate's log. Returns the created activity
  (with its assigned id and `createdAt`), or `null` when the electorate id is
  unknown. Traps for a non-admin caller.

## Authentication and authorization

Reads are public: `listElectorates`, `getElectorate`, `listActivities`,
`getNationalSummary`, and `listRecentActivities` are query methods with no
caller check, so anonymous and signed-in callers alike may call them.

Mutations are admin-only. `updateCampaignDetails` and `addActivity` require a
signed-in caller whose role is `#admin`; any other caller (anonymous, or a
signed-in non-admin) is rejected with a trap:
`Unauthorized: Only admins can update campaign details` or
`Unauthorized: Only admins can add activities`.

Registration is a prerequisite for admin access. A caller becomes known to the
authorization system only by calling `_initialize_access_control` (or completing
`_internet_identity_sign_in_finish`) while signed in. The first principal to
register becomes `#admin`; every later principal becomes `#user`. An
unregistered caller is not an admin, so a mutation from one traps as above.
`isCallerAdmin()` reports the caller's admin status and `getCallerUserRole()`
reports the caller's role (an anonymous caller is reported as `#guest`).

Identity derivation: the app's frontend pins an Internet Identity derivation
origin, published at `/.well-known/ii-derivation-origin` when available. An
agent already holding the user's Internet Identity authorization derives the
correct per-app principal against that origin (for example
`icp identity link web <name> --app <host>`). Such a delegation acts with the
user's full authority in this app until it expires. A principal derived against
a different origin is a different principal than the one the frontend
registered, so it is unregistered even if it belongs to the app's owner.

## Units and encodings

- `ElectorateId` and `ActivityId` are `Nat` identifiers.
- `registeredVoters` is a count of registered voters (a plain number, not a
  percentage).
- `Timestamp` values (`date`, `createdAt`, `updatedAt`) are `Int` nanoseconds
  since the Unix epoch (IC time). Divide by 1,000,000,000 for seconds.
- `SeatType` is the variant `#open` or `#regional`.
- `SupportLevel` is one of `#Strong`, `#Leaning`, `#Undecided`, `#Weak`,
  `#Opposed`.
- `ActivityType` is one of `#event`, `#contact`, `#note`.
- Optional values (`?Electorate`, `?CampaignActivity`) are Candid `opt`; a
  missing record is `null`, not an error.

## Lifecycle and polling

Reads are immediate and consistent with the last committed update. There is no
job, queue, or asynchronous processing: a mutation takes effect as soon as its
call completes, and a subsequent read observes it. To poll for new activity,
call `listRecentActivities(limit)` and compare the newest `createdAt` (or the
largest `id`) against the previous result; activity ids increase monotonically
and `createdAt` is non-decreasing in insertion order.

## Mutation retry safety

`updateCampaignDetails` is idempotent: applying the same details twice leaves
the same campaign fields (only `updatedAt` advances). `addActivity` is NOT
idempotent: each successful call appends a new activity with a fresh id, so
retrying after a timeout can create a duplicate entry. Confirm the result of an
`addActivity` call before retrying it. Both mutations are rejected before any
state change when the caller is not an admin.

## Errors and gotchas

- Non-admin mutations trap; the trap message is the only signal, and the whole
  message is rolled back, so no partial write occurs.
- `getElectorate` and `updateCampaignDetails` return `null` for an unknown id;
  `addActivity` returns `null` for an unknown electorate id. These are normal
  outcomes, not errors.
- `listActivities` returns an empty array for an unknown electorate id, so it
  cannot be used to test whether an electorate exists — use `getElectorate`.
- `listRecentActivities` orders by `createdAt` descending; ties are not
  otherwise ordered.
- `getNationalSummary` counts distinct provinces from the electorates actually
  stored, so it reflects the seeded data rather than a fixed national list.
";
  };
};
