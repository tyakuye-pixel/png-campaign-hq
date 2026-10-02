import { Skeleton } from "@/components/ui/skeleton";
import {
  ActivityType,
  type CampaignActivity,
  activityTypeLabel,
  formatTimestamp,
} from "@/lib/electorates";
import { cn } from "@/lib/utils";
import { CalendarDays, FileText, Handshake, Megaphone } from "lucide-react";
import type { ReactNode } from "react";

const ACTIVITY_ICONS: Record<ActivityType, ReactNode> = {
  [ActivityType.event]: <Megaphone className="size-4" />,
  [ActivityType.contact]: <Handshake className="size-4" />,
  [ActivityType.note]: <FileText className="size-4" />,
};

const ACTIVITY_TONES: Record<ActivityType, string> = {
  [ActivityType.event]: "bg-primary/10 text-primary",
  [ActivityType.contact]:
    "bg-[oklch(var(--support-leaning)/0.14)] text-[oklch(var(--support-leaning))]",
  [ActivityType.note]: "bg-secondary text-secondary-foreground",
};

interface ActivityLogProps {
  activities: CampaignActivity[];
  isLoading: boolean;
}

export function ActivityLog({ activities, isLoading }: ActivityLogProps) {
  if (isLoading) {
    return (
      <ol
        data-ocid="electorate.activity_list.loading_state"
        className="space-y-4"
      >
        {Array.from({ length: 4 }, (_, i) => `activity-skeleton-${i}`).map(
          (id) => (
            <li key={id} className="flex gap-4">
              <Skeleton className="size-9 shrink-0 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-full max-w-md" />
              </div>
            </li>
          ),
        )}
      </ol>
    );
  }

  if (activities.length === 0) {
    return (
      <div
        data-ocid="electorate.activity_list.empty_state"
        className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-secondary/30 px-6 py-12 text-center"
      >
        <span className="flex size-11 items-center justify-center rounded-full bg-secondary text-muted-foreground">
          <CalendarDays className="size-5" />
        </span>
        <p className="mt-3 font-display text-sm font-semibold text-foreground">
          No campaign activity recorded
        </p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Events, contacts, and notes logged against this electorate will appear
          here, newest first.
        </p>
      </div>
    );
  }

  return (
    <ol data-ocid="electorate.activity_list" className="space-y-1">
      {activities.map((activity, index) => (
        <li
          key={activity.id.toString()}
          data-ocid={`electorate.activity_item.${index + 1}`}
          className="flex gap-4 rounded-lg px-2 py-3 transition-colors hover:bg-secondary/40"
        >
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-md",
              ACTIVITY_TONES[activity.activityType],
            )}
          >
            {ACTIVITY_ICONS[activity.activityType]}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-display text-sm font-semibold text-foreground">
                {activityTypeLabel(activity.activityType)}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarDays className="size-3.5" />
                {formatTimestamp(activity.date)}
              </span>
            </div>
            <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {activity.description}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
