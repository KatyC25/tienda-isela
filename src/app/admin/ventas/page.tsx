import { prisma } from "@/lib/prisma";
import PuntoDeVenta from "./PuntoDeVenta";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function VentasPage() {
  const productosRaw = await prisma.producto.findMany({
    orderBy: { nombre: "asc" },
    select: {
      id: true,
      nombre: true,
      precioVenta: true,
      stock: true,
      descuento: true,
    },
  });
  const productosLimpios = productosRaw.map((p) => ({
    ...p,
    precioVenta: Number(p.precioVenta),
    descuento: p.descuento || 0,
  }));

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Punto de Venta
          </h1>
          <p className="text-slate-500 text-sm">
            Selecciona productos para armar el pedido.
          </p>
        </div>

        <Button variant="outline" asChild>
          <Link href="/admin/ventas/historial">
            <History className="mr-2 h-4 w-4" />
            Historial
          </Link>
        </Button>
      </div>

      <PuntoDeVenta productos={productosLimpios} />
    </div>
  );
}
