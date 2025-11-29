import { prisma } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import NuevoProductoDialog from "./NuevoProductoDialog";

export const dynamic = "force-dynamic";

export default async function InventarioPage() {
  const productos = await prisma.producto.findMany({
    orderBy: { nombre: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Inventario General
          </h1>
          <p className="text-slate-500">
            Gestiona tu catálogo de productos y precios.
          </p>
        </div>

        <NuevoProductoDialog />
      </div>

      <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Precio Base</TableHead>
                <TableHead className="text-center">Stock Actual</TableHead>
                <TableHead className="text-center">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productos.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-slate-500"
                  >
                    Tu catálogo está vacío. ¡Agrega tu primer producto arriba!
                  </TableCell>
                </TableRow>
              ) : (
                productos.map((prod) => (
                  <TableRow key={prod.id}>
                    <TableCell className="font-medium">{prod.nombre}</TableCell>
                    <TableCell>
                      C$ {Number(prod.precioVenta).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center font-bold">
                      {prod.stock}
                    </TableCell>
                    <TableCell className="text-center">
                      {prod.stock > 0 ? (
                        <Badge className="bg-green-600">Disponible</Badge>
                      ) : (
                        <Badge variant="outline" className="text-slate-400">
                          Sin Stock
                        </Badge>
                      )}
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
