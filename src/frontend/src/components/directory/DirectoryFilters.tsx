import type {
  DirectoryFiltersController,
  DirectorySortDir,
  DirectorySortKey,
} from "@/components/directory/useDirectoryFilters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUPPORT_LEVELS, supportLevelLabel } from "@/lib/electorates";
import { Search, X } from "lucide-react";

interface DirectoryFiltersProps {
  controller: DirectoryFiltersController;
  provinces: string[];
  regions: string[];
}

const SORT_OPTIONS: { value: DirectorySortKey; label: string }[] = [
  { value: "name", label: "Name" },
  { value: "registeredVoters", label: "Registered voters" },
  { value: "updatedAt", label: "Last updated" },
];

export function DirectoryFilters({
  controller,
  provinces,
  regions,
}: DirectoryFiltersProps) {
  const { filters, setFilter, setFilters, clearFilters, isFiltered } =
    controller;

  return (
    <div
      data-ocid="directory.filters"
      className="flex flex-col gap-3 border-b border-border bg-card px-4 py-4 sm:px-5"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            data-ocid="directory.search_input"
            type="search"
            value={filters.q}
            onChange={(event) => setFilter("q", event.target.value)}
            placeholder="Search by electorate, province, or region…"
            aria-label="Search electorates"
            className="h-9 pl-9"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:flex lg:items-center">
          <Select
            value={filters.province}
            onValueChange={(value) => setFilter("province", value)}
          >
            <SelectTrigger
              data-ocid="directory.province_select"
              aria-label="Filter by province"
              className="w-full lg:w-[11rem]"
            >
              <SelectValue placeholder="Province" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All provinces</SelectItem>
              {provinces.map((province) => (
                <SelectItem key={province} value={province}>
                  {province}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.region}
            onValueChange={(value) => setFilter("region", value)}
          >
            <SelectTrigger
              data-ocid="directory.region_select"
              aria-label="Filter by region"
              className="w-full lg:w-[10rem]"
            >
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All regions</SelectItem>
              {regions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.support}
            onValueChange={(value) => setFilter("support", value)}
          >
            <SelectTrigger
              data-ocid="directory.support_select"
              aria-label="Filter by support level"
              className="w-full lg:w-[10rem]"
            >
              <SelectValue placeholder="Support" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All support levels</SelectItem>
              {SUPPORT_LEVELS.map((level) => (
                <SelectItem key={level} value={level}>
                  {supportLevelLabel(level)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={`${filters.sort}:${filters.dir}`}
            onValueChange={(value) => {
              const [sort, dir] = value.split(":") as [
                DirectorySortKey,
                DirectorySortDir,
              ];
              setFilters({ sort, dir });
            }}
          >
            <SelectTrigger
              data-ocid="directory.sort_select"
              aria-label="Sort electorates"
              className="w-full lg:w-[13rem]"
            >
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem
                  key={`${option.value}:asc`}
                  value={`${option.value}:asc`}
                >
                  {option.label} · A–Z
                </SelectItem>
              ))}
              {SORT_OPTIONS.map((option) => (
                <SelectItem
                  key={`${option.value}:desc`}
                  value={`${option.value}:desc`}
                >
                  {option.label} · Z–A
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isFiltered ? (
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Filters are reflected in the page URL.
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            data-ocid="directory.clear_filters_button"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="size-3.5" />
            Clear filters
          </Button>
        </div>
      ) : null}
    </div>
  );
}
