"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function registrarIngreso(formData: FormData) {
  const pacaId = formData.get("pacaId") as string;
  const productoId = formData.get("productoId") as string;
  const cantidad = Number(formData.get("cantidad"));
  const costo = formData.get("costo") ? Number(formData.get("costo")) : null;

  if (!productoId || cantidad < 1) {
    throw new Error("Datos inválidos");
  }

  await prisma.$transaction([
    prisma.prendaPaca.create({
      data: {
        pacaId,
        productoId,
        cantidad,
        costoUnitarioEstimado: costo,
      },
    }),

    prisma.producto.update({
      where: { id: productoId },
      data: {
        stock: {
          increment: cantidad,
        },
      },
    }),
  ]);

  revalidatePath(`/admin/pacas/${pacaId}`);
}
