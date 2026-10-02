import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback, useMemo } from "react";

export type DirectorySortKey = "name" | "registeredVoters" | "updatedAt";
export type DirectorySortDir = "asc" | "desc";

export interface DirectorySearch {
  q: string;
  province: string;
  region: string;
  support: string;
  sort: DirectorySortKey;
  dir: DirectorySortDir;
}

export const DEFAULT_DIRECTORY_SEARCH: DirectorySearch = {
  q: "",
  province: "all",
  region: "all",
  support: "all",
  sort: "name",
  dir: "asc",
};

const SORT_KEYS: DirectorySortKey[] = ["name", "registeredVoters", "updatedAt"];

function isSortKey(value: unknown): value is DirectorySortKey {
  return (
    typeof value === "string" && SORT_KEYS.includes(value as DirectorySortKey)
  );
}

/** Normalize raw URL search params into a complete, valid filter state. */
export function normalizeDirectorySearch(
  raw: Record<string, unknown>,
): DirectorySearch {
  return {
    q: typeof raw.q === "string" ? raw.q : DEFAULT_DIRECTORY_SEARCH.q,
    province:
      typeof raw.province === "string"
        ? raw.province
        : DEFAULT_DIRECTORY_SEARCH.province,
    region:
      typeof raw.region === "string"
        ? raw.region
        : DEFAULT_DIRECTORY_SEARCH.region,
    support:
      typeof raw.support === "string"
        ? raw.support
        : DEFAULT_DIRECTORY_SEARCH.support,
    sort: isSortKey(raw.sort) ? raw.sort : DEFAULT_DIRECTORY_SEARCH.sort,
    dir: raw.dir === "desc" ? "desc" : "asc",
  };
}

export interface DirectoryFiltersController {
  filters: DirectorySearch;
  setFilter: <K extends keyof DirectorySearch>(
    key: K,
    value: DirectorySearch[K],
  ) => void;
  setFilters: (patch: Partial<DirectorySearch>) => void;
  toggleSort: (key: DirectorySortKey) => void;
  clearFilters: () => void;
  isFiltered: boolean;
}

/**
 * Reads and writes the directory filter/sort state through the route's URL
 * search params so views are shareable and survive a refresh.
 */
export function useDirectoryFilters(): DirectoryFiltersController {
  const rawSearch = useSearch({ strict: false }) as Record<string, unknown>;
  const navigate = useNavigate();

  const filters = useMemo(
    () => normalizeDirectorySearch(rawSearch),
    [rawSearch],
  );

  const commit = useCallback(
    (next: DirectorySearch) => {
      void navigate({
        to: "/electorates",
        search: next,
        replace: true,
      });
    },
    [navigate],
  );

  const setFilter = useCallback(
    <K extends keyof DirectorySearch>(key: K, value: DirectorySearch[K]) => {
      commit({ ...filters, [key]: value });
    },
    [commit, filters],
  );

  const setFilters = useCallback(
    (patch: Partial<DirectorySearch>) => {
      commit({ ...filters, ...patch });
    },
    [commit, filters],
  );

  const toggleSort = useCallback(
    (key: DirectorySortKey) => {
      if (filters.sort === key) {
        commit({ ...filters, dir: filters.dir === "asc" ? "desc" : "asc" });
      } else {
        commit({
          ...filters,
          sort: key,
          dir: key === "name" ? "asc" : "desc",
        });
      }
    },
    [commit, filters],
  );

  const clearFilters = useCallback(() => {
    commit({ ...DEFAULT_DIRECTORY_SEARCH });
  }, [commit]);

  const isFiltered =
    filters.q !== "" ||
    filters.province !== "all" ||
    filters.region !== "all" ||
    filters.support !== "all";

  return {
    filters,
    setFilter,
    setFilters,
    toggleSort,
    clearFilters,
    isFiltered,
  };
}
