import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type CampaignActivity,
  type Electorate,
  activityTypeLabel,
  formatTimestamp,
} from "@/lib/electorates";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { CalendarDays, FileText, Handshake, MapPin } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ACTIVITY_ICONS: Record<string, LucideIcon> = {
  event: CalendarDays,
  contact: Handshake,
  note: FileText,
};

interface ActivityFeedProps {
  activities: CampaignActivity[];
  electorateNames: Map<string, string>;
  isLoading: boolean;
}

export function ActivityFeed({
  activities,
  electorateNames,
  isLoading,
}: ActivityFeedProps) {
  if (isLoading) {
    return (
      <ul
        data-ocid="overview.activity_list.loading_state"
        className="space-y-3"
      >
        {Array.from({ length: 5 }, (_, i) => `activity-skeleton-${i}`).map(
          (id) => (
            <li key={id} className="flex gap-3">
              <Skeleton className="size-9 shrink-0 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </li>
          ),
        )}
      </ul>
    );
  }

  if (activities.length === 0) {
    return (
      <div
        data-ocid="overview.activity_list.empty_state"
        className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 px-6 py-12 text-center"
      >
        <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <FileText className="size-5" aria-hidden="true" />
        </span>
        <p className="mt-3 font-display text-sm font-semibold text-foreground">
          No campaign activity recorded yet
        </p>
        <p className="mt-1 max-w-sm text-xs text-muted-foreground">
          Activity logged against an electorate will appear here as it is
          recorded.
        </p>
      </div>
    );
  }

  return (
    <ul data-ocid="overview.activity_list" className="divide-y divide-border">
      {activities.map((activity, index) => {
        const Icon = ACTIVITY_ICONS[activity.activityType] ?? FileText;
        const electorateName =
          electorateNames.get(activity.electorateId.toString()) ??
          "Unknown electorate";
        return (
          <li
            key={activity.id.toString()}
            data-ocid={`overview.activity.item.${index + 1}`}
            className="flex gap-3 py-3.5 first:pt-0 last:pb-0"
          >
            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <Link
                  to="/electorates/$id"
                  params={{ id: activity.electorateId.toString() }}
                  data-ocid={`overview.activity.electorate_link.${index + 1}`}
                  className="inline-flex items-center gap-1 font-display text-sm font-semibold text-foreground transition-colors hover:text-primary"
                >
                  <MapPin className="size-3.5 text-muted-foreground" />
                  {electorateName}
                </Link>
                <Badge
                  variant="secondary"
                  className="rounded-full px-2 py-0 text-[11px] font-medium"
                >
                  {activityTypeLabel(activity.activityType)}
                </Badge>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {activity.description}
              </p>
              <p
                className={cn(
                  "mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground",
                )}
              >
                <CalendarDays className="size-3.5" aria-hidden="true" />
                {formatTimestamp(activity.date)}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
