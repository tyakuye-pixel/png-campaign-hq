import { SupportLevelBadge } from "@/components/SupportLevelBadge";
import {
  type Electorate,
  formatCount,
  formatRegisteredVoters,
  formatRelativeTime,
  seatTypeLabel,
} from "@/lib/electorates";
import { Building2, MapPin, Users } from "lucide-react";

interface ElectorateProfileHeaderProps {
  electorate: Electorate;
}

export function ElectorateProfileHeader({
  electorate,
}: ElectorateProfileHeaderProps) {
  const facts = [
    {
      label: "Province",
      value: electorate.province,
      icon: <MapPin className="size-4" />,
    },
    {
      label: "Region",
      value: electorate.region,
      icon: <Building2 className="size-4" />,
    },
    {
      label: "Seat type",
      value: seatTypeLabel(electorate.seatType),
      icon: <Building2 className="size-4" />,
    },
  ];

  return (
    <section
      data-ocid="electorate.profile_panel"
      className="overflow-hidden rounded-lg border border-border bg-card shadow-subtle"
    >
      <div className="rule-accent" />
      <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-3">
          <p className="label-caps">Electorate Profile</p>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
              {electorate.name}
            </h1>
            <SupportLevelBadge level={electorate.supportLevel} />
          </div>
          <p className="text-sm text-muted-foreground">
            {electorate.province} Province · {electorate.region} Region
          </p>
        </div>

        <div className="grid shrink-0 grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-8">
          {facts.map((fact) => (
            <div key={fact.label} className="min-w-0">
              <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                {fact.icon}
                {fact.label}
              </p>
              <p className="mt-1 truncate font-display text-base font-semibold text-foreground">
                {fact.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-px border-t border-border bg-border sm:grid-cols-2">
        <div className="flex items-center gap-3 bg-card px-6 py-4">
          <span className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Users className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="label-caps">Registered voters</p>
            <p className="font-display text-xl font-semibold tabular-nums text-foreground">
              {formatRegisteredVoters(electorate.registeredVoters)}
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                {formatCount(electorate.registeredVoters)}
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-card px-6 py-4">
          <span className="flex size-9 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
            <Building2 className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="label-caps">Last updated</p>
            <p className="font-display text-xl font-semibold text-foreground">
              {formatRelativeTime(electorate.updatedAt)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
