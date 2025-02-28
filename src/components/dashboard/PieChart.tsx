"use client";
import { PieChart, Pie, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4CAF50",
  "#FF9F40",
  "#9966FF",
  "#C9CBCF",
  "#FFCD56",
];

const chartConfig: Record<string, { label: string; color: string }> = {
  Travel: { label: "Travel", color: "#f44336" },
  Transfer: { label: "Transfer", color: "#ff9800" },
  Payroll: { label: "Payroll", color: "#00bcd4" },
  "Airlines and Aviation Services": {
    label: "Airlines and Aviation Services",
    color: "#9c27b0",
  },
};

const processData = (data: any[]) => {
  const categoryTotals: Record<string, number> = {};
  data.forEach(({ amount, category }) => {
    if (amount < 0) {
      const splitAmount = Math.abs(amount) / category.length;
      category.forEach((cat: string) => {
        if (!categoryTotals[cat]) {
          categoryTotals[cat] = 0;
        }
        categoryTotals[cat] += splitAmount;
      });
    }
  });

  return Object.entries(categoryTotals).map(([name, value], index) => ({
    name,
    value,
    color: chartConfig[name]?.color || COLORS[index % COLORS.length],
  }));
};

const ExpensePieChart = ({ transactions }: { transactions: any[] }) => {
  const data = processData(transactions);

  return (
    <Card className="flex flex-col flex-1">
      <CardHeader className="items-center pb-0">
        <CardTitle>Categorized Expenses</CardTitle>
        <CardDescription>
          Visualize your expenses based on different categories.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={40}
              outerRadius={80}
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ExpensePieChart;
