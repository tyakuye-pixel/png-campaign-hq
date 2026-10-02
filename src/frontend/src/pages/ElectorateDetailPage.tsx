import { ActivityLog } from "@/components/detail/ActivityLog";
import { AddActivityForm } from "@/components/detail/AddActivityForm";
import { CampaignStatusPanel } from "@/components/detail/CampaignStatusPanel";
import { ElectorateProfileHeader } from "@/components/detail/ElectorateProfileHeader";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useActivities,
  useAddActivity,
  useElectorate,
  useIsAdmin,
  useUpdateCampaignDetails,
} from "@/hooks/useElectorates";
import type { ElectorateId } from "@/lib/electorates";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, MapPinned, ShieldAlert } from "lucide-react";

function parseElectorateId(raw: string): ElectorateId | null {
  if (!/^\d+$/.test(raw)) return null;
  try {
    return BigInt(raw);
  } catch {
    return null;
  }
}

function DetailSkeleton() {
  return (
    <div data-ocid="electorate.loading_state" className="space-y-6">
      <Skeleton className="h-40 w-full rounded-lg" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Skeleton className="h-72 rounded-lg lg:col-span-1" />
        <Skeleton className="h-72 rounded-lg lg:col-span-2" />
      </div>
    </div>
  );
}

function NotFoundState() {
  return (
    <div
      data-ocid="electorate.not_found_state"
      className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card px-6 py-16 text-center"
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
        <ShieldAlert className="size-6" />
      </span>
      <h1 className="mt-4 font-display text-xl font-semibold text-foreground">
        Electorate not found
      </h1>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        This electorate is not in the national register. It may have been
        removed, or the link may be incorrect.
      </p>
      <Button asChild variant="outline" size="sm" className="mt-5">
        <Link to="/electorates" data-ocid="electorate.back_to_directory_link">
          <ArrowLeft className="size-3.5" />
          Back to directory
        </Link>
      </Button>
    </div>
  );
}

export function ElectorateDetailPage() {
  const { id: rawId } = useParams({ from: "/layout/electorates/$id" });
  const electorateId = parseElectorateId(rawId);

  const { data: electorate, isLoading } = useElectorate(electorateId);
  const { data: activities = [], isLoading: activitiesLoading } =
    useActivities(electorateId);
  const { data: isAdmin = false } = useIsAdmin();
  const updateDetails = useUpdateCampaignDetails();
  const addActivity = useAddActivity();

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (!electorate) {
    return <NotFoundState />;
  }

  const sortedActivities = [...activities].sort((a, b) =>
    a.date === b.date ? 0 : a.date > b.date ? -1 : 1,
  );

  return (
    <div data-ocid="electorate.page" className="space-y-6">
      <Link
        to="/electorates"
        data-ocid="electorate.back_link"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        All electorates
      </Link>

      <ElectorateProfileHeader electorate={electorate} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <CampaignStatusPanel
            electorate={electorate}
            isAdmin={isAdmin}
            isSaving={updateDetails.isPending}
            error={
              updateDetails.isError
                ? "Could not save campaign details. Please try again."
                : null
            }
            onSave={(details) =>
              updateDetails.mutate({ id: electorate.id, details })
            }
          />
        </div>

        <section
          data-ocid="electorate.activity_panel"
          className="rounded-lg border border-border bg-card shadow-subtle lg:col-span-2"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
            <div>
              <h2 className="font-display text-base font-semibold text-foreground">
                Activity Log
              </h2>
              <p className="text-xs text-muted-foreground">
                {activities.length > 0
                  ? `${activities.length} ${
                      activities.length === 1 ? "entry" : "entries"
                    } · newest first`
                  : "Events, contacts, and notes"}
              </p>
            </div>
            {isAdmin ? (
              <AddActivityForm
                isSaving={addActivity.isPending}
                error={
                  addActivity.isError
                    ? "Could not record activity. Please try again."
                    : null
                }
                onAdd={(input) =>
                  addActivity.mutate({ electorateId: electorate.id, input })
                }
              />
            ) : null}
          </div>

          <div className="px-4 py-4 sm:px-6">
            <ActivityLog
              activities={sortedActivities}
              isLoading={activitiesLoading}
            />
          </div>
        </section>
      </div>

      {!isAdmin ? (
        <p
          data-ocid="electorate.readonly_notice"
          className="flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-4 py-3 text-xs text-muted-foreground"
        >
          <MapPinned className="size-3.5 shrink-0" />
          You are viewing this electorate read-only. Sign in as an administrator
          to update campaign details or record activity.
        </p>
      ) : null}
    </div>
  );
}
