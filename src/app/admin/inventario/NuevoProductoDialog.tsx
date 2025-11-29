"use client";

import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { crearProducto } from "@/actions/productos-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NuevoProductoDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      await crearProducto(formData);
      toast.success("Producto creado exitosamente");
      setOpen(false);
    } catch (_error) {
      toast.error("Error al crear producto");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-pink-600 hover:bg-pink-700">
          <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Producto / Categoría</DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="nombre">Nombre del Producto</Label>
            <Input
              id="nombre"
              name="nombre"
              placeholder="Ej: Camisa Manga Larga"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="precio">Precio de Venta Sugerido (C$)</Label>
            <Input
              id="precio"
              name="precio"
              type="number"
              step="0.01"
              required
            />
            <p className="text-xs text-slate-500">
              Este precio se usará por defecto al vender.
            </p>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
