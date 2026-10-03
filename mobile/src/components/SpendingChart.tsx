import React, { useMemo, useState } from "react";
import { View, Text } from "react-native";
import { BarChart } from "react-native-gifted-charts";

type Transaction = {
  id: string;
  accountId: string;
  title: string;
  amount: number;
  date: string;
};

type Props = {
  transactions: Transaction[];
  accountId: string;
  selectedDay: number | null;
  onSelectDay: (day: number) => void;
};

export default function SpendingChart({
  transactions,
  accountId,
  selectedDay,
  onSelectDay,
}: Props) {
  const [chartWidth, setChartWidth] = useState(0);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const expenses = useMemo(() => {
    return transactions.filter((tx) => {
      const date = new Date(tx.date);

      return (
        tx.accountId === accountId &&
        tx.amount !== 0  &&
        date.getFullYear() === year &&
        date.getMonth() === month 
      );
    });
  }, [transactions, accountId, year, month]);

  const chartData = useMemo(() => {
    return Array.from(
      { length: daysInMonth },
      (_, index) => {
        const day = index + 1;

        const total = expenses
          .filter(
            (tx) =>
              new Date(tx.date).getDate() === day
          )
          .reduce(
            (sum, tx) => sum + Math.abs(tx.amount),
            0
          );

        return {
          value: total,
          label: day % 1 === 0 ? String(day) : "",
          frontColor:
            selectedDay === day
              ? "#FFA66B"
              : "#625752",
        };
      }
    );
  }, [expenses, daysInMonth, selectedDay]);

  return (
    <View
      className="w-[90%] self-center rounded-3xl bg-gray-900 px-5 pt-5 pb-8 overflow-hidden"
    >
      <Text className="mb-5 text-xl font-bold text-white">
        Расходы
      </Text>

      <View
        className="w-full"
        onLayout={(event) => {
          const width = event.nativeEvent.layout.width;

          if (width !== chartWidth) {
            setChartWidth(width);
          }
        }}
      >
        {chartWidth > 0 && (
          <BarChart
            data={chartData}
            width={chartWidth}
            height={170}
            barWidth={14}
            spacing={10}
            initialSpacing={16}
            endSpacing={10}
            roundedTop
            isAnimated
            hideRules
            hideYAxisText
            yAxisLabelWidth={0}
            yAxisThickness={0}
            xAxisThickness={0}
            xAxisLabelsHeight={20}
            xAxisLabelsVerticalShift={0}
            xAxisLabelTextStyle={{
              color: "#888888",
              fontSize: 15,
              textAlign: "center",
            }}
            scrollToEnd
            showScrollIndicator={false}
            onPress={(_item, index) => {
              onSelectDay(index + 1);
            }}
          />
        )}
      </View>
    </View>
  );
}