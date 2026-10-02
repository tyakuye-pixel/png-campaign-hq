import { SupportLevel, supportLevelLabel } from "@/lib/electorates";
import { cn } from "@/lib/utils";

const SUPPORT_STYLES: Record<SupportLevel, string> = {
  [SupportLevel.Strong]:
    "bg-[oklch(var(--support-strong)/0.14)] text-[oklch(var(--support-strong))] ring-[oklch(var(--support-strong)/0.35)]",
  [SupportLevel.Leaning]:
    "bg-[oklch(var(--support-leaning)/0.14)] text-[oklch(var(--support-leaning))] ring-[oklch(var(--support-leaning)/0.35)]",
  [SupportLevel.Undecided]:
    "bg-[oklch(var(--support-undecided)/0.16)] text-[oklch(var(--support-undecided))] ring-[oklch(var(--support-undecided)/0.4)]",
  [SupportLevel.Weak]:
    "bg-[oklch(var(--support-weak)/0.14)] text-[oklch(var(--support-weak))] ring-[oklch(var(--support-weak)/0.35)]",
  [SupportLevel.Opposed]:
    "bg-[oklch(var(--support-opposed)/0.14)] text-[oklch(var(--support-opposed))] ring-[oklch(var(--support-opposed)/0.35)]",
};

const SUPPORT_DOTS: Record<SupportLevel, string> = {
  [SupportLevel.Strong]: "bg-[oklch(var(--support-strong))]",
  [SupportLevel.Leaning]: "bg-[oklch(var(--support-leaning))]",
  [SupportLevel.Undecided]: "bg-[oklch(var(--support-undecided))]",
  [SupportLevel.Weak]: "bg-[oklch(var(--support-weak))]",
  [SupportLevel.Opposed]: "bg-[oklch(var(--support-opposed))]",
};

interface SupportLevelBadgeProps {
  level: SupportLevel;
  className?: string;
  showDot?: boolean;
}

export function SupportLevelBadge({
  level,
  className,
  showDot = true,
}: SupportLevelBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        SUPPORT_STYLES[level],
        className,
      )}
    >
      {showDot ? (
        <span
          aria-hidden="true"
          className={cn("size-1.5 shrink-0 rounded-full", SUPPORT_DOTS[level])}
        />
      ) : null}
      {supportLevelLabel(level)}
    </span>
  );
}
