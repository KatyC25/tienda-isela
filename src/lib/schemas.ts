import { z } from "zod";

export const pacaSchema = z.object({
  nombre: z.string().min(3, {
    message: "El nombre debe tener al menos 3 caracteres.",
  }),
  
  descripcion: z.string().optional(),
  
  costo: z.coerce
    .number({ message: "El costo debe ser un número válido" })
    .min(0.01, { message: "El costo debe ser mayor a 0" }),
    
  fecha: z.coerce.date({
    message: "Fecha inválida" 
  }),
});