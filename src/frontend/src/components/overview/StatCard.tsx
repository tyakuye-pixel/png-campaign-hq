import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  ocid: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  ocid,
  className,
}: StatCardProps) {
  return (
    <div
      data-ocid={ocid}
      className={cn(
        "relative overflow-hidden rounded-lg border border-border bg-card shadow-subtle",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-primary"
      />
      <div className="flex items-start justify-between gap-3 p-5 pt-6">
        <div className="min-w-0">
          <p className="label-caps">{label}</p>
          <p className="mt-2 font-display text-3xl font-semibold leading-none tracking-tight text-foreground tabular-nums">
            {value}
          </p>
          {hint ? (
            <p className="mt-2 truncate text-xs text-muted-foreground">
              {hint}
            </p>
          ) : null}
        </div>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="size-4.5" aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}
