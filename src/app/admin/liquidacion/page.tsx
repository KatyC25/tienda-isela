import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import TablaLiquidacion from "./TablaLiquidacion";

export const dynamic = "force-dynamic";

export default async function Page() {
  await requireAuth();

  const productosRaw = await prisma.producto.findMany({
    orderBy: { nombre: "asc" },
    where: { stock: { gt: 0 } },
  });

  const productos = productosRaw.map((p) => ({
    ...p,
    precioVenta: Number(p.precioVenta),
    descuento: p.descuento || 0,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Centro de Liquidaciones
        </h1>
        <p className="text-slate-500">
          Gestiona descuentos masivos para mover inventario antiguo.
        </p>
      </div>

      <TablaLiquidacion productos={productos} />
    </div>
  );
}
