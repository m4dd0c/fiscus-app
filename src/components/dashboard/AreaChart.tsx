"use client";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { XAxis, Line, LineChart, CartesianGrid } from "recharts";

const processData = (data: any[]) => {
  const grouped: Record<
    string,
    { date: string; inbound: number; outbound: number }
  > = {};

  data.forEach(({ date, amount }) => {
    if (!grouped[date]) {
      grouped[date] = { date, inbound: 0, outbound: 0 };
    }
    if (amount < 0) {
      grouped[date].inbound += Math.abs(amount);
    } else {
      grouped[date].outbound += amount;
    }
  });

  return Object.values(grouped);
};

const chartConfig = {
  inbound: {
    label: "inbound",
    color: "#e91e63",
  },
  outbound: {
    label: "outbound",
    color: "#8a4af3",
  },
} satisfies ChartConfig;
const TransactionChart = ({ transactions }: { transactions: any[] }) => {
  const data = processData(transactions);
  return (
    <Card>
      <CardHeader>
        <CardTitle>InBounds & OutBounds</CardTitle>
        <CardDescription>Visualize your income and expenses.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[50vh]  w-full" config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => format(new Date(value), "MMM, dd")}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="inbound"
              type="monotone"
              stroke="var(--color-inbound)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="outbound"
              type="monotone"
              stroke="var(--color-outbound)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default TransactionChart;
