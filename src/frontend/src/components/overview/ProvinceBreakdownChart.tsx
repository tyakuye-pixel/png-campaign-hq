import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ProvinceCount } from "@/lib/electorates";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  count: {
    label: "Electorates",
    color: "oklch(var(--chart-1))",
  },
} satisfies ChartConfig;

interface ProvinceBreakdownChartProps {
  data: ProvinceCount[];
}

export function ProvinceBreakdownChart({ data }: ProvinceBreakdownChartProps) {
  const rows = [...data]
    .map((entry) => ({
      province: entry.province,
      count: Number(entry.count),
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <ChartContainer
      config={chartConfig}
      data-ocid="overview.province_chart"
      className="aspect-auto h-[22rem] w-full"
    >
      <BarChart
        accessibilityLayer
        data={rows}
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
        <YAxis
          type="category"
          dataKey="province"
          width={104}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          interval={0}
        />
        <ChartTooltip
          cursor={{ fill: "oklch(var(--muted))" }}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Bar
          dataKey="count"
          fill="var(--color-count)"
          radius={[0, 3, 3, 0]}
          maxBarSize={18}
        />
      </BarChart>
    </ChartContainer>
  );
}
