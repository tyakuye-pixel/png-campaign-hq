import { SupportLevelBadge } from "@/components/SupportLevelBadge";
import type {
  DirectorySortDir,
  DirectorySortKey,
} from "@/components/directory/useDirectoryFilters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type Electorate,
  formatCount,
  formatRegisteredVoters,
  formatRelativeTime,
} from "@/lib/electorates";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

interface DirectoryTableProps {
  electorates: Electorate[];
  sort: DirectorySortKey;
  dir: DirectorySortDir;
  onToggleSort: (key: DirectorySortKey) => void;
}

interface SortableHeadProps {
  label: string;
  sortKey: DirectorySortKey;
  activeKey: DirectorySortKey;
  dir: DirectorySortDir;
  onToggleSort: (key: DirectorySortKey) => void;
  align?: "left" | "right";
  className?: string;
}

function SortableHead({
  label,
  sortKey,
  activeKey,
  dir,
  onToggleSort,
  align = "left",
  className,
}: SortableHeadProps) {
  const active = activeKey === sortKey;
  const Icon = !active ? ChevronsUpDown : dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <TableHead
      className={cn(align === "right" && "text-right", className)}
      aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"}
    >
      <button
        type="button"
        data-ocid={`directory.sort.${sortKey}`}
        onClick={() => onToggleSort(sortKey)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-sm text-xs font-semibold uppercase tracking-[0.1em] transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          active ? "text-foreground" : "text-muted-foreground",
          align === "right" && "flex-row-reverse",
        )}
      >
        {label}
        <Icon
          aria-hidden="true"
          className={cn("size-3.5", active ? "opacity-100" : "opacity-50")}
        />
      </button>
    </TableHead>
  );
}

export function DirectoryTable({
  electorates,
  sort,
  dir,
  onToggleSort,
}: DirectoryTableProps) {
  return (
    <Table data-ocid="directory.table" className="min-w-[52rem]">
      <TableHeader className="sticky top-0 z-10 bg-card">
        <TableRow className="hover:bg-transparent">
          <SortableHead
            label="Electorate"
            sortKey="name"
            activeKey={sort}
            dir={dir}
            onToggleSort={onToggleSort}
            className="pl-4"
          />
          <TableHead className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            Province
          </TableHead>
          <TableHead className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            Region
          </TableHead>
          <SortableHead
            label="Registered"
            sortKey="registeredVoters"
            activeKey={sort}
            dir={dir}
            onToggleSort={onToggleSort}
            align="right"
          />
          <TableHead className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            Support
          </TableHead>
          <SortableHead
            label="Updated"
            sortKey="updatedAt"
            activeKey={sort}
            dir={dir}
            onToggleSort={onToggleSort}
            align="right"
            className="pr-4"
          />
        </TableRow>
      </TableHeader>
      <TableBody>
        {electorates.map((electorate, index) => (
          <TableRow
            key={electorate.id.toString()}
            data-ocid={`directory.row.${index + 1}`}
            className="group"
          >
            <TableCell className="pl-4">
              <Link
                to="/electorates/$id"
                params={{ id: electorate.id.toString() }}
                data-ocid={`directory.link.${index + 1}`}
                className="font-medium text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {electorate.name}
              </Link>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {electorate.province}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {electorate.region}
            </TableCell>
            <TableCell
              className="text-right tabular-nums text-foreground"
              title={formatCount(electorate.registeredVoters)}
            >
              {formatRegisteredVoters(electorate.registeredVoters)}
            </TableCell>
            <TableCell>
              <SupportLevelBadge level={electorate.supportLevel} />
            </TableCell>
            <TableCell className="pr-4 text-right text-muted-foreground">
              {formatRelativeTime(electorate.updatedAt)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
