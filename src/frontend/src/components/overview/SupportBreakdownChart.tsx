import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  SUPPORT_LEVELS,
  type SupportLevel,
  type SupportLevelCount,
  supportLevelLabel,
} from "@/lib/electorates";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const SUPPORT_COLORS: Record<SupportLevel, string> = {
  Strong: "oklch(var(--support-strong))",
  Leaning: "oklch(var(--support-leaning))",
  Undecided: "oklch(var(--support-undecided))",
  Weak: "oklch(var(--support-weak))",
  Opposed: "oklch(var(--support-opposed))",
};

const chartConfig = Object.fromEntries(
  SUPPORT_LEVELS.map((level) => [
    level,
    { label: supportLevelLabel(level), color: SUPPORT_COLORS[level] },
  ]),
) satisfies ChartConfig;

interface SupportBreakdownChartProps {
  data: SupportLevelCount[];
}

export function SupportBreakdownChart({ data }: SupportBreakdownChartProps) {
  const counts = new Map(
    data.map((entry) => [entry.supportLevel, Number(entry.count)]),
  );
  const row = Object.fromEntries(
    SUPPORT_LEVELS.map((level) => [level, counts.get(level) ?? 0]),
  ) as Record<SupportLevel, number>;

  return (
    <ChartContainer
      config={chartConfig}
      data-ocid="overview.support_chart"
      className="aspect-auto h-[22rem] w-full"
    >
      <BarChart
        accessibilityLayer
        data={[row]}
        layout="vertical"
        margin={{ left: 4, right: 16, top: 4, bottom: 4 }}
      >
        <CartesianGrid horizontal={false} strokeDasharray="3 3" />
        <XAxis
          type="number"
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis type="category" hide />
        <ChartTooltip
          cursor={{ fill: "oklch(var(--muted))" }}
          content={<ChartTooltipContent indicator="line" />}
        />
        {SUPPORT_LEVELS.map((level) => (
          <Bar
            key={level}
            dataKey={level}
            stackId="support"
            fill={`var(--color-${level})`}
            maxBarSize={44}
          />
        ))}
        <ChartLegend content={<ChartLegendContent />} />
      </BarChart>
    </ChartContainer>
  );
}
