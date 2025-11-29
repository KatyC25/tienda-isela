import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import VentaDetalleDialog from "./VentaDetalleDialog";

export const dynamic = "force-dynamic";

export default async function HistorialVentasPage() {
  await requireAuth();

  const ventas = await prisma.venta.findMany({
    orderBy: { fechaVenta: "desc" },
    include: {
      detalles: {
        include: {
          producto: true,
        },
      },
    },
    take: 50,
  });

  const hoy = new Date().toISOString().split("T")[0];
  const ventasHoy = ventas.filter(
    (v) => v.fechaVenta.toISOString().split("T")[0] === hoy,
  );
  const totalHoy = ventasHoy.reduce((sum, v) => sum + Number(v.totalVenta), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/ventas">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Historial de Ventas
            </h1>
            <p className="text-slate-500">Últimas transacciones realizadas.</p>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 px-6 py-3 rounded-xl flex flex-col items-end">
          <span className="text-green-700 text-xs font-bold uppercase tracking-wider">
            Vendido Hoy
          </span>
          <span className="text-2xl font-black text-green-800">
            C$ {totalHoy.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha / Hora</TableHead>
                <TableHead className="text-center">Artículos</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Método</TableHead>
                <TableHead className="text-right">Detalle</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ventas.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-slate-500"
                  >
                    No hay ventas registradas aún.
                  </TableCell>
                </TableRow>
              ) : (
                ventas.map((venta) => (
                  <TableRow key={venta.id}>
                    <TableCell className="font-medium text-slate-600">
                      <div className="flex flex-col">
                        <span>
                          {new Date(venta.fechaVenta).toLocaleDateString(
                            "es-NI",
                          )}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(venta.fechaVenta).toLocaleTimeString(
                            "es-NI",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {venta.detalles.reduce((sum, d) => sum + d.cantidad, 0)}{" "}
                      items
                    </TableCell>
                    <TableCell className="font-bold text-slate-900">
                      C$ {Number(venta.totalVenta).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                        {venta.metodoPago}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <VentaDetalleDialog
                        venta={{
                          id: venta.id,
                          fecha: venta.fechaVenta,
                          total: venta.totalVenta,
                          detalles: venta.detalles,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
