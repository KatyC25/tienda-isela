import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ReportesPage() {
  const pacas = await prisma.paca.findMany({
    orderBy: { fechaCompra: "desc" },
    include: {
      contenido: {
        include: { producto: true },
      },
    },
  });

  const reportePacas = pacas.map((paca) => {
    const costo = Number(paca.costoTotal);
    const ventaPotencial = paca.contenido.reduce((sum, item) => {
      return sum + item.cantidad * Number(item.producto.precioVenta);
    }, 0);

    const gananciaEstimada = ventaPotencial - costo;
    const margen = costo > 0 ? (gananciaEstimada / costo) * 100 : 0;

    return {
      ...paca,
      costo,
      ventaPotencial,
      gananciaEstimada,
      margen,
    };
  });

  const haceUnMes = new Date();
  haceUnMes.setDate(haceUnMes.getDate() - 30);

  const inventarioLento = await prisma.producto.findMany({
    where: {
      stock: { gt: 0 },
      createdAt: { lt: haceUnMes },
    },
    orderBy: { createdAt: "asc" },
    take: 10,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Reportes Financieros
        </h1>
        <p className="text-slate-500">
          Análisis de rentabilidad y salud del inventario.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <CardTitle>Rentabilidad por Paca (ROI)</CardTitle>
          </div>
          <CardDescription>
            Comparativa entre el costo de la paca y el valor total de venta de
            sus prendas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre Paca</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">
                    Inversión (Costo)
                  </TableHead>
                  <TableHead className="text-right">Retorno Esperado</TableHead>
                  <TableHead className="text-right">Ganancia Neta</TableHead>
                  <TableHead className="text-center">Margen %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportePacas.map((paca) => (
                  <TableRow key={paca.id}>
                    <TableCell className="font-medium">{paca.nombre}</TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {new Date(paca.fechaCompra).toLocaleDateString("es-NI")}
                    </TableCell>
                    <TableCell className="text-right text-red-600 font-medium">
                      C$ {paca.costo.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-blue-600">
                      C$ {paca.ventaPotencial.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-bold text-green-700">
                      C$ {paca.gananciaEstimada.toLocaleString()}
                    </TableCell>
                    <TableCell className="w-[150px]">
                      <div className="flex flex-col gap-1 items-center">
                        <span className="text-xs font-bold">
                          {paca.margen.toFixed(0)}%
                        </span>
                        <Progress
                          value={Math.min(paca.margen, 100)}
                          className="h-2 w-20"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="h-5 w-5" />
                <CardTitle className="text-lg">Atención Requerida</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-yellow-900">
              <p className="mb-2">
                Los productos listados a la derecha llevan{" "}
                <strong>más de 30 días</strong> en inventario y aún tienen
                stock.
              </p>
              <p>
                <strong>Recomendación:</strong> Considera enviarlos a la sección
                de <em>Liquidación</em> con un descuento del 20% al 50% para
                recuperar capital.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Inventario de Lenta Rotación (Más de 30 días)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Precio Actual</TableHead>
                  <TableHead className="text-center">Stock Estancado</TableHead>
                  <TableHead className="text-right">Días en Tienda</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventarioLento.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-slate-500"
                    >
                      ¡Excelente! No tienes inventario estancado.
                    </TableCell>
                  </TableRow>
                ) : (
                  inventarioLento.map((prod) => {
                    const dias = Math.floor(
                      (Date.now() - new Date(prod.createdAt).getTime()) /
                        (1000 * 3600 * 24),
                    );
                    return (
                      <TableRow key={prod.id}>
                        <TableCell className="font-medium">
                          {prod.nombre}
                        </TableCell>
                        <TableCell>C$ {Number(prod.precioVenta)}</TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className="bg-red-50 text-red-700 border-red-200"
                          >
                            {prod.stock} un.
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-bold text-slate-600">
                          {dias} días
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
