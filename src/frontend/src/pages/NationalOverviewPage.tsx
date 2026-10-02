import { ActivityFeed } from "@/components/overview/ActivityFeed";
import { ElectorateSearch } from "@/components/overview/ElectorateSearch";
import { ProvinceBreakdownChart } from "@/components/overview/ProvinceBreakdownChart";
import { StatCard } from "@/components/overview/StatCard";
import { SupportBreakdownChart } from "@/components/overview/SupportBreakdownChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useElectorates,
  useNationalSummary,
  useRecentActivities,
} from "@/hooks/useElectorates";
import { formatCount, formatRegisteredVoters } from "@/lib/electorates";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Building2,
  MapPinned,
  Users,
} from "lucide-react";
import { useMemo } from "react";

export function NationalOverviewPage() {
  const summaryQuery = useNationalSummary();
  const electoratesQuery = useElectorates();
  const activitiesQuery = useRecentActivities(8);

  const summary = summaryQuery.data ?? null;
  const electorates = electoratesQuery.data ?? [];
  const activities = activitiesQuery.data ?? [];

  const electorateNames = useMemo(
    () =>
      new Map(
        electorates.map((electorate) => [
          electorate.id.toString(),
          electorate.name,
        ]),
      ),
    [electorates],
  );

  const isLoading =
    summaryQuery.isLoading ||
    electoratesQuery.isLoading ||
    activitiesQuery.isLoading;

  const hasError =
    summaryQuery.isError || electoratesQuery.isError || activitiesQuery.isError;

  return (
    <div data-ocid="overview.page" className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="label-caps">Papua New Guinea · National Campaign</p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-foreground">
            National Overview
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
            National totals, electorate breakdowns, and the latest campaign
            activity across all provinces.
          </p>
        </div>
        <ElectorateSearch
          electorates={electorates}
          className="w-full lg:w-80"
        />
      </header>

      {hasError ? (
        <div
          data-ocid="overview.error_state"
          className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          Some national figures could not be loaded. Refresh the page to try
          again.
        </div>
      ) : null}

      <section
        data-ocid="overview.kpi_section"
        aria-label="National totals"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {isLoading || !summary ? (
          Array.from({ length: 4 }, (_, i) => `kpi-skeleton-${i}`).map((id) => (
            <Skeleton key={id} className="h-[7.5rem] rounded-lg" />
          ))
        ) : (
          <>
            <StatCard
              ocid="overview.kpi.electorates"
              label="Electorates Tracked"
              value={formatCount(summary.totalElectorates)}
              hint="Across all provinces"
              icon={MapPinned}
            />
            <StatCard
              ocid="overview.kpi.provinces"
              label="Provinces"
              value={formatCount(summary.totalProvinces)}
              hint="National coverage"
              icon={Building2}
            />
            <StatCard
              ocid="overview.kpi.voters"
              label="Registered Voters"
              value={formatRegisteredVoters(summary.totalRegisteredVoters)}
              hint={`${formatCount(summary.totalRegisteredVoters)} on the roll`}
              icon={Users}
            />
            <StatCard
              ocid="overview.kpi.activities"
              label="Activities Logged"
              value={formatCount(summary.totalActivities)}
              hint="Campaign updates recorded"
              icon={Activity}
            />
          </>
        )}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card data-ocid="overview.province_panel" className="shadow-subtle">
          <CardHeader className="border-b border-border">
            <CardTitle className="font-display text-base font-semibold">
              Electorates by Province
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Number of tracked electorates in each province
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            {isLoading || !summary ? (
              <Skeleton className="h-[22rem] w-full rounded-lg" />
            ) : summary.countsByProvince.length === 0 ? (
              <p
                data-ocid="overview.province_chart.empty_state"
                className="py-16 text-center text-sm text-muted-foreground"
              >
                No province breakdown available yet.
              </p>
            ) : (
              <ProvinceBreakdownChart data={summary.countsByProvince} />
            )}
          </CardContent>
        </Card>

        <Card data-ocid="overview.support_panel" className="shadow-subtle">
          <CardHeader className="border-b border-border">
            <CardTitle className="font-display text-base font-semibold">
              Electorates by Support Level
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Campaign support distribution across all electorates
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            {isLoading || !summary ? (
              <Skeleton className="h-[22rem] w-full rounded-lg" />
            ) : summary.countsBySupportLevel.length === 0 ? (
              <p
                data-ocid="overview.support_chart.empty_state"
                className="py-16 text-center text-sm text-muted-foreground"
              >
                No support-level breakdown available yet.
              </p>
            ) : (
              <SupportBreakdownChart data={summary.countsBySupportLevel} />
            )}
          </CardContent>
        </Card>
      </section>

      <Card data-ocid="overview.activity_panel" className="shadow-subtle">
        <CardHeader className="flex-row items-center justify-between gap-3 border-b border-border">
          <div>
            <CardTitle className="font-display text-base font-semibold">
              Recent Campaign Activity
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Latest updates across all electorates
            </p>
          </div>
          <Link
            to="/electorates"
            data-ocid="overview.directory_link"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            View directory
            <ArrowRight className="size-4" />
          </Link>
        </CardHeader>
        <CardContent className="pt-4">
          <ActivityFeed
            activities={activities}
            electorateNames={electorateNames}
            isLoading={activitiesQuery.isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
