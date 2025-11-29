"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

const productoSchema = z.object({
  nombre: z.string().min(3, "El nombre es muy corto"),
  precio: z.coerce.number().min(0, "El precio no puede ser negativo"),
});

export async function crearProducto(formData: FormData) {
  await requireAuth();

  const data = {
    nombre: formData.get("nombre"),
    precio: formData.get("precio"),
  };
  const result = productoSchema.safeParse(data);
  if (!result.success) {
    throw new Error("Datos inválidos");
  }

  await prisma.producto.create({
    data: {
      nombre: result.data.nombre,
      precioVenta: result.data.precio,
      stock: 0,
    },
  });

  revalidatePath("/admin/inventario");
  revalidatePath("/admin/pacas/[id]");
}
