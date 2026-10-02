import { Input } from "@/components/ui/input";
import type { Electorate } from "@/lib/electorates";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";

interface ElectorateSearchProps {
  electorates: Electorate[];
  className?: string;
}

export function ElectorateSearch({
  electorates,
  className,
}: ElectorateSearchProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return electorates
      .filter(
        (electorate) =>
          electorate.name.toLowerCase().includes(term) ||
          electorate.province.toLowerCase().includes(term),
      )
      .slice(0, 6);
  }, [electorates, query]);

  const goTo = (id: bigint) => {
    setQuery("");
    void navigate({
      to: "/electorates/$id",
      params: { id: id.toString() },
    });
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search electorates by name or province…"
          aria-label="Search electorates"
          data-ocid="overview.search_input"
          className="h-11 pl-9 pr-9"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            data-ocid="overview.search_clear_button"
            className="absolute right-2.5 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        ) : null}
      </div>

      {query.trim() ? (
        <div
          data-ocid="overview.search_results"
          className="absolute z-30 mt-2 w-full overflow-hidden rounded-lg border border-border bg-popover shadow-elevated"
        >
          {results.length === 0 ? (
            <p
              data-ocid="overview.search_results.empty_state"
              className="px-4 py-3 text-sm text-muted-foreground"
            >
              No electorates match “{query.trim()}”.
            </p>
          ) : (
            <ul className="max-h-72 overflow-y-auto py-1">
              {results.map((electorate, index) => (
                <li key={electorate.id.toString()}>
                  <button
                    type="button"
                    onClick={() => goTo(electorate.id)}
                    data-ocid={`overview.search_result.item.${index + 1}`}
                    className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:outline-none"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-foreground">
                        {electorate.name}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {electorate.province} · {electorate.region}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      View
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
