import { Plus } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
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

export const dynamic = "force-dynamic";

export default async function PacasPage() {
  await requireAuth();

  const pacas = await prisma.paca.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { contenido: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Gestión de Pacas
          </h1>
          <p className="text-slate-500">
            Administra tus compras e ingresos de inventario.
          </p>
        </div>
        <Button asChild className="bg-pink-600 hover:bg-pink-700">
          <Link href="/admin/pacas/nueva">
            <Plus className="mr-2 h-4 w-4" /> Nueva Paca
          </Link>
        </Button>
      </div>

      <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Fecha Compra</TableHead>
                <TableHead>Costo</TableHead>
                <TableHead className="text-center">Items Registrados</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pacas.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-slate-500"
                  >
                    No hay pacas registradas. ¡Crea la primera!
                  </TableCell>
                </TableRow>
              ) : (
                pacas.map((paca) => (
                  <TableRow key={paca.id}>
                    <TableCell className="font-medium">{paca.nombre}</TableCell>
                    <TableCell>
                      {new Date(paca.fechaCompra).toLocaleDateString("es-NI")}
                    </TableCell>
                    <TableCell>
                      C$ {Number(paca.costoTotal).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">
                        {paca._count.contenido} items
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/pacas/${paca.id}`}>
                          Ver Detalle
                        </Link>
                      </Button>
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
