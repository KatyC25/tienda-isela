import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { ArrowLeft, PackagePlus, Tag } from "lucide-react";
import RegistrarIngreso from "./RegistrarIngreso";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PacaDetallePage({ params }: PageProps) {
  const { id } = await params;

  const paca = await prisma.paca.findUnique({
    where: { id },
    include: {
      contenido: {
        include: { producto: true },
      },
    },
  });
  const productosDisponibles = await prisma.producto.findMany({
    orderBy: { nombre: "asc" },
  });

  if (!paca) return notFound();

  const totalPiezas = paca.contenido.reduce(
    (sum, item) => sum + item.cantidad,
    0,
  );
  const valorInventario = paca.contenido.reduce((sum, item) => {
    return sum + item.cantidad * Number(item.producto.precioVenta);
  }, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/pacas">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{paca.nombre}</h1>
          <p className="text-slate-500 flex items-center gap-2 text-sm">
            Comprada el {new Date(paca.fechaCompra).toLocaleDateString("es-NI")}
            <span className="text-slate-300">•</span>
            ID: {paca.id.slice(0, 8)}...
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Inversión Inicial
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              C$ {Number(paca.costoTotal).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Piezas Procesadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-600">
              {totalPiezas}{" "}
              <span className="text-sm font-normal text-slate-400">
                unidades
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Valor Estimado Venta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              C$ {valorInventario.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Si se vende todo a precio actual
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between mt-8">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Tag className="h-5 w-5 text-slate-500" />
          Contenido de la Paca
        </h2>

        <RegistrarIngreso pacaId={paca.id} productos={productosDisponibles} />
      </div>

      <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead className="text-center">Cantidad</TableHead>
                <TableHead className="text-right">Precio Venta (u)</TableHead>
                <TableHead className="text-right">Valor Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paca.contenido.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-32 text-center text-slate-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <PackagePlus className="h-8 w-8 text-slate-300" />
                      <p>Esta paca aún no tiene inventario registrado.</p>
                      <p className="text-xs">
                        Usa el botón "Registrar Ingreso" para empezar a contar.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paca.contenido.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.producto.nombre}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="text-base px-3">
                        +{item.cantidad}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      C$ {Number(item.producto.precioVenta)}
                    </TableCell>
                    <TableCell className="text-right font-bold text-slate-700">
                      C${" "}
                      {(
                        item.cantidad * Number(item.producto.precioVenta)
                      ).toLocaleString()}
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
