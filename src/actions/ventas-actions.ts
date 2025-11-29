"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type ItemVenta = {
  productoId: string;
  cantidad: number;
  precio: number;
};

export async function registrarVenta(items: ItemVenta[], total: number) {
  if (items.length === 0) throw new Error("El carrito está vacío");

  await prisma.$transaction(async (tx) => {
    const venta = await tx.venta.create({
      data: {
        totalVenta: total,
        metodoPago: "EFECTIVO",
      },
    });

    for (const item of items) {
      const producto = await tx.producto.findUnique({
        where: { id: item.productoId },
      });

      if (!producto || producto.stock < item.cantidad) {
        throw new Error(
          `Stock insuficiente para el producto: ${producto?.nombre}`,
        );
      }

      await tx.detalleVenta.create({
        data: {
          ventaId: venta.id,
          productoId: item.productoId,
          cantidad: item.cantidad,
          precioVenta: item.precio,
        },
      });

      await tx.producto.update({
        where: { id: item.productoId },
        data: {
          stock: {
            decrement: item.cantidad,
          },
        },
      });
    }
  });

  revalidatePath("/admin/inventario");
  revalidatePath("/admin/ventas");
  revalidatePath("/admin");
}
