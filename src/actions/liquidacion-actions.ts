"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export async function aplicarDescuentoMasivo(
  productoIds: string[],
  porcentaje: number,
) {
  await requireAuth();

  if (porcentaje < 0 || porcentaje > 100) {
    throw new Error("El porcentaje debe estar entre 0 y 100");
  }

  await prisma.producto.updateMany({
    where: {
      id: { in: productoIds },
    },
    data: {
      descuento: porcentaje,
    },
  });

  revalidatePath("/admin/liquidacion");
  revalidatePath("/admin/inventario");
  revalidatePath("/admin/ventas");
}
