"use server";

import { prisma } from "@/lib/prisma";
import { pacaSchema } from "@/lib/schemas"; 
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function crearPaca(formData: FormData) {
  
  const datosBrutos = {
    nombre: formData.get("nombre"),
    descripcion: formData.get("descripcion"),
    costo: formData.get("costo"),
    fecha: formData.get("fecha"),
  };

  const resultado = pacaSchema.safeParse(datosBrutos);

  if (!resultado.success) {
    console.error(resultado.error.flatten().fieldErrors);
    throw new Error("Datos inválidos. Revisa el formulario.");
  }

  await prisma.paca.create({
    data: {
      nombre: resultado.data.nombre,
      descripcion: resultado.data.descripcion,
      costoTotal: resultado.data.costo, 
      fechaCompra: resultado.data.fecha, 
    },
  });

  revalidatePath("/admin/pacas");
  redirect("/admin/pacas");
}