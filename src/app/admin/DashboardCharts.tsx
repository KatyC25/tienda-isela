"use client";

import ReactECharts from "echarts-for-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ChartProps = {
  ventasPorDia: { fecha: string; total: number }[];
  topProductos: { name: string; value: number }[];
  estadoInventario: { name: string; value: number }[];
};

export default function DashboardCharts({
  ventasPorDia,
  topProductos,
  estadoInventario,
}: ChartProps) {
  const salesOption = {
    tooltip: {
      trigger: "axis",
      formatter: "{b}: C$ {c}",
    },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: {
      type: "category",
      data: ventasPorDia.map((d) => d.fecha),
      axisLine: { lineStyle: { color: "#94a3b8" } },
    },
    yAxis: {
      type: "value",
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "#e2e8f0" } },
    },
    series: [
      {
        data: ventasPorDia.map((d) => d.total),
        type: "bar",
        showBackground: true,
        backgroundStyle: { color: "rgba(180, 180, 180, 0.1)" },
        itemStyle: { color: "#db2777", borderRadius: [4, 4, 0, 0] }, // Color Rosa Isela
        barWidth: "60%",
      },
    ],
  };

  const productsOption = {
    tooltip: { trigger: "item" },
    legend: { bottom: "0%", left: "center" },
    series: [
      {
        name: "Más Vendidos",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: { show: false, position: "center" },
        emphasis: {
          label: { show: true, fontSize: 16, fontWeight: "bold" },
        },
        data: topProductos,
      },
    ],
  };
  const stockOption = {
    tooltip: { trigger: "item" },
    color: ["#16a34a", "#dc2626"],
    legend: { bottom: "0%", left: "center" },
    series: [
      {
        name: "Inventario",
        type: "pie",
        radius: "65%",
        center: ["50%", "50%"],
        data: estadoInventario,
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {/* Gráfico 1: Ventas  */}
      <Card className="shadow-sm md:col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle>Ventas Semanales</CardTitle>
        </CardHeader>
        <CardContent>
          <ReactECharts option={salesOption} style={{ height: "300px" }} />
        </CardContent>
      </Card>

      {/* Gráfico 2: Top Productos */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Top Productos</CardTitle>
        </CardHeader>
        <CardContent>
          <ReactECharts option={productsOption} style={{ height: "300px" }} />
        </CardContent>
      </Card>

      {/* Gráfico 3: Salud del Inventario */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Estado del Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <ReactECharts option={stockOption} style={{ height: "300px" }} />
        </CardContent>
      </Card>
    </div>
  );
}
