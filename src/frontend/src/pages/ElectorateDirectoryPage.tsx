import { DirectoryFilters } from "@/components/directory/DirectoryFilters";
import { DirectoryTable } from "@/components/directory/DirectoryTable";
import { useDirectoryFilters } from "@/components/directory/useDirectoryFilters";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useElectorates } from "@/hooks/useElectorates";
import { type Electorate, formatCount } from "@/lib/electorates";
import { MapPinned, SearchX } from "lucide-react";
import { useMemo } from "react";

const SKELETON_ROWS = Array.from(
  { length: 8 },
  (_, index) => `directory-skeleton-${index}`,
);

function compareElectorates(
  a: Electorate,
  b: Electorate,
  sort: "name" | "registeredVoters" | "updatedAt",
): number {
  if (sort === "name") return a.name.localeCompare(b.name);
  if (sort === "registeredVoters") {
    return a.registeredVoters < b.registeredVoters
      ? -1
      : a.registeredVoters > b.registeredVoters
        ? 1
        : 0;
  }
  return a.updatedAt < b.updatedAt ? -1 : a.updatedAt > b.updatedAt ? 1 : 0;
}

export function ElectorateDirectoryPage() {
  const { data: electorates, isLoading, isError, refetch } = useElectorates();
  const {
    filters,
    setFilter,
    setFilters,
    toggleSort,
    clearFilters,
    isFiltered,
  } = useDirectoryFilters();

  const provinces = useMemo(() => {
    const set = new Set<string>();
    for (const electorate of electorates ?? []) set.add(electorate.province);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [electorates]);

  const regions = useMemo(() => {
    const set = new Set<string>();
    for (const electorate of electorates ?? []) set.add(electorate.region);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [electorates]);

  const visible = useMemo(() => {
    const query = filters.q.trim().toLowerCase();
    const filtered = (electorates ?? []).filter((electorate) => {
      if (
        filters.province !== "all" &&
        electorate.province !== filters.province
      )
        return false;
      if (filters.region !== "all" && electorate.region !== filters.region)
        return false;
      if (
        filters.support !== "all" &&
        electorate.supportLevel !== filters.support
      )
        return false;
      if (query === "") return true;
      return (
        electorate.name.toLowerCase().includes(query) ||
        electorate.province.toLowerCase().includes(query) ||
        electorate.region.toLowerCase().includes(query)
      );
    });
    const sorted = [...filtered].sort((a, b) =>
      compareElectorates(a, b, filters.sort),
    );
    return filters.dir === "desc" ? sorted.reverse() : sorted;
  }, [electorates, filters]);

  const total = electorates?.length ?? 0;
  const totalVoters = useMemo(
    () =>
      (electorates ?? []).reduce(
        (sum, electorate) => sum + electorate.registeredVoters,
        0n,
      ),
    [electorates],
  );

  return (
    <div data-ocid="directory.page" className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p className="label-caps">Papua New Guinea · National Campaign</p>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Electorate Directory
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Search, filter, and sort every electorate across all 22 provinces.
            Public read-only view.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-4 rounded-lg border border-border bg-card px-4 py-2.5">
          <div>
            <p className="label-caps">Electorates</p>
            <p className="font-display text-lg font-semibold tabular-nums text-foreground">
              {isLoading ? "—" : formatCount(BigInt(total))}
            </p>
          </div>
          <span aria-hidden="true" className="h-8 w-px bg-border" />
          <div>
            <p className="label-caps">Registered voters</p>
            <p className="font-display text-lg font-semibold tabular-nums text-foreground">
              {isLoading ? "—" : formatCount(totalVoters)}
            </p>
          </div>
        </div>
      </header>

      <section className="overflow-hidden rounded-lg border border-border bg-card shadow-subtle">
        <DirectoryFilters
          controller={{
            filters,
            setFilter,
            setFilters,
            toggleSort,
            clearFilters,
            isFiltered,
          }}
          provinces={provinces}
          regions={regions}
        />

        {isLoading ? (
          <div data-ocid="directory.loading_state" className="p-4">
            <div className="space-y-2">
              {SKELETON_ROWS.map((id) => (
                <Skeleton key={id} className="h-11 w-full" />
              ))}
            </div>
          </div>
        ) : isError ? (
          <div
            data-ocid="directory.error_state"
            className="flex flex-col items-center gap-3 px-6 py-16 text-center"
          >
            <span className="flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <SearchX className="size-5" />
            </span>
            <div className="space-y-1">
              <p className="font-display text-base font-semibold text-foreground">
                Could not load electorates
              </p>
              <p className="text-sm text-muted-foreground">
                The electorate register is temporarily unavailable.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              data-ocid="directory.retry_button"
              onClick={() => void refetch()}
            >
              Retry
            </Button>
          </div>
        ) : visible.length === 0 ? (
          <div
            data-ocid="directory.empty_state"
            className="flex flex-col items-center gap-3 px-6 py-16 text-center"
          >
            <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <MapPinned className="size-5" />
            </span>
            <div className="space-y-1">
              <p className="font-display text-base font-semibold text-foreground">
                No electorates match these filters
              </p>
              <p className="text-sm text-muted-foreground">
                Try a different search term or reset the filters.
              </p>
            </div>
            {isFiltered ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                data-ocid="directory.empty_clear_button"
                onClick={clearFilters}
              >
                Clear filters
              </Button>
            ) : null}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/40 px-4 py-2 sm:px-5">
              <p
                data-ocid="directory.result_count"
                className="text-xs text-muted-foreground"
              >
                Showing{" "}
                <span className="font-semibold tabular-nums text-foreground">
                  {formatCount(BigInt(visible.length))}
                </span>{" "}
                of{" "}
                <span className="font-semibold tabular-nums text-foreground">
                  {formatCount(BigInt(total))}
                </span>{" "}
                electorates
              </p>
              {isFiltered ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  data-ocid="directory.clear_filters_button"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Clear filters
                </Button>
              ) : null}
            </div>
            <DirectoryTable
              electorates={visible}
              sort={filters.sort}
              dir={filters.dir}
              onToggleSort={toggleSort}
            />
          </>
        )}
      </section>
    </div>
  );
}
