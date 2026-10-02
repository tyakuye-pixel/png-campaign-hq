import {
  ActivityType,
  type CampaignActivity,
  type Electorate,
  type ElectorateId,
  type NationalSummary,
  type NewActivity,
  type ProvinceCount,
  SeatType,
  SupportLevel,
  type SupportLevelCount,
  type Timestamp,
  type UpdateCampaignDetails,
} from "@/backend";

export { ActivityType, SeatType, SupportLevel };
export type {
  CampaignActivity,
  Electorate,
  ElectorateId,
  NationalSummary,
  NewActivity,
  ProvinceCount,
  SupportLevelCount,
  Timestamp,
  UpdateCampaignDetails,
};

/** Canonical ordered support scale, strongest to most opposed. */
export const SUPPORT_LEVELS: SupportLevel[] = [
  SupportLevel.Strong,
  SupportLevel.Leaning,
  SupportLevel.Undecided,
  SupportLevel.Weak,
  SupportLevel.Opposed,
];

const SUPPORT_LABELS: Record<SupportLevel, string> = {
  [SupportLevel.Strong]: "Strong",
  [SupportLevel.Leaning]: "Leaning",
  [SupportLevel.Undecided]: "Undecided",
  [SupportLevel.Weak]: "Weak",
  [SupportLevel.Opposed]: "Opposed",
};

const SUPPORT_DESCRIPTIONS: Record<SupportLevel, string> = {
  [SupportLevel.Strong]: "Reliably committed to the campaign",
  [SupportLevel.Leaning]: "Favourable but not yet committed",
  [SupportLevel.Undecided]: "No clear position established",
  [SupportLevel.Weak]: "Unfavourable and drifting away",
  [SupportLevel.Opposed]: "Actively aligned against the campaign",
};

const SEAT_TYPE_LABELS: Record<SeatType, string> = {
  [SeatType.open]: "Open",
  [SeatType.regional]: "Regional",
};

const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  [ActivityType.event]: "Event",
  [ActivityType.contact]: "Contact",
  [ActivityType.note]: "Note",
};

export function supportLevelLabel(level: SupportLevel): string {
  return SUPPORT_LABELS[level] ?? String(level);
}

export function supportLevelDescription(level: SupportLevel): string {
  return SUPPORT_DESCRIPTIONS[level] ?? "";
}

export function seatTypeLabel(seatType: SeatType): string {
  return SEAT_TYPE_LABELS[seatType] ?? String(seatType);
}

export function activityTypeLabel(activityType: ActivityType): string {
  return ACTIVITY_TYPE_LABELS[activityType] ?? String(activityType);
}

/** Compact registered-voter count, e.g. 5_700_000 -> "5.7M". */
export function formatRegisteredVoters(value: bigint): string {
  const n = Number(value);
  if (!Number.isFinite(n)) return "0";
  if (n >= 1_000_000)
    return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return n.toLocaleString("en-US");
}

/** Full grouped count, e.g. 5_700_000 -> "5,700,000". */
export function formatCount(value: bigint): string {
  return Number(value).toLocaleString("en-US");
}

/** Motoko Time.now() is a nanosecond bigint; convert before any Date use. */
export function timestampToDate(timestamp: Timestamp): Date | null {
  const date = new Date(Number(timestamp / 1_000_000n));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatTimestamp(timestamp: Timestamp): string {
  const date = timestampToDate(timestamp);
  if (!date) return "—";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatRelativeTime(timestamp: Timestamp): string {
  const date = timestampToDate(timestamp);
  if (!date) return "—";
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / 86_400_000);
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 30) return `${diffDays} days ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12)
    return `${diffMonths} ${diffMonths === 1 ? "month" : "months"} ago`;
  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears} ${diffYears === 1 ? "year" : "years"} ago`;
}

/** Convert a yyyy-mm-dd input value into a nanosecond timestamp. */
export function dateInputToTimestamp(value: string): Timestamp {
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return 0n;
  return BigInt(parsed.getTime()) * 1_000_000n;
}

/** Convert a nanosecond timestamp into a yyyy-mm-dd input value. */
export function timestampToDateInput(timestamp: Timestamp): string {
  const date = timestampToDate(timestamp);
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}
