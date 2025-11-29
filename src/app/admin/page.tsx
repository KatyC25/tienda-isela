import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, ShoppingBag, TrendingUp } from "lucide-react";
import DashboardCharts from "./DashboardCharts";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const ventasHoy = await prisma.venta.aggregate({
    _sum: { totalVenta: true },
    where: { fechaVenta: { gte: hoy } },
  });

  const stockTotal = await prisma.producto.aggregate({
    _sum: { stock: true },
  });

  const totalPacas = await prisma.paca.count();

  const hace7dias = new Date();
  hace7dias.setDate(hace7dias.getDate() - 7);

  const ventasSemanaRaw = await prisma.venta.findMany({
    where: { fechaVenta: { gte: hace7dias } },
    select: { fechaVenta: true, totalVenta: true },
  });

  const ventasPorDiaMap = new Map<string, number>();
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString("es-NI", { weekday: "short" }); // "lun."
    ventasPorDiaMap.set(label, 0);
  }

  ventasSemanaRaw.forEach((v) => {
    const label = new Date(v.fechaVenta).toLocaleDateString("es-NI", {
      weekday: "short",
    });
    const actual = ventasPorDiaMap.get(label) || 0;
    ventasPorDiaMap.set(label, actual + Number(v.totalVenta));
  });

  const dataGraficoBarras = Array.from(ventasPorDiaMap).map(
    ([fecha, total]) => ({
      fecha,
      total,
    }),
  );

  const topProductosRaw = await prisma.detalleVenta.groupBy({
    by: ["productoId"],
    _sum: { cantidad: true },
    orderBy: { _sum: { cantidad: "desc" } },
    take: 5,
  });

  const topProductosData = await Promise.all(
    topProductosRaw.map(async (item) => {
      const prod = await prisma.producto.findUnique({
        where: { id: item.productoId },
      });
      return {
        name: prod?.nombre || "Desconocido",
        value: item._sum.cantidad || 0,
      };
    }),
  );

  const stockNormal = await prisma.producto.count({
    where: {
      stock: { gt: 0 },
      descuento: 0,
    },
  });

  const stockLiquidacion = await prisma.producto.count({
    where: {
      stock: { gt: 0 },
      descuento: { gt: 0 },
    },
  });

  const dataStock = [
    { name: "Precio Normal", value: stockNormal },
    { name: "En Liquidación", value: stockLiquidacion },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Panel de Control</h1>
        <p className="text-slate-500">Resumen de actividad de Tienda Isela.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Ventas de Hoy
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              C$ {Number(ventasHoy._sum.totalVenta || 0).toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Ingresos en efectivo caja
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Prendas en Inventario
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {stockTotal._sum.stock || 0}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Unidades listas para venta
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Pacas Procesadas
            </CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {totalPacas}
            </div>
            <p className="text-xs text-slate-500 mt-1">Total histórico</p>
          </CardContent>
        </Card>
      </div>

      <DashboardCharts
        ventasPorDia={dataGraficoBarras}
        topProductos={topProductosData}
        estadoInventario={dataStock}
      />
    </div>
  );
}
