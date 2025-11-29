"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PackagePlus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { registrarIngreso } from "@/actions/inventario-actions";

type Producto = {
  id: string;
  nombre: string;
};
export default function RegistrarIngreso({
  pacaId,
  productos,
}: {
  pacaId: string;
  productos: Producto[];
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      await registrarIngreso(formData);

      toast.success("Prendas agregadas y stock actualizado");
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Error al registrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-slate-900 hover:bg-slate-800">
          <PackagePlus className="mr-2 h-4 w-4" />
          Registrar Ingreso
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ingresar Inventario</DialogTitle>
          <DialogDescription>
            Selecciona un producto existente.
          </DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="grid gap-4 py-4">
          <input type="hidden" name="pacaId" value={pacaId} />
          <div className="grid gap-2">
            <Label htmlFor="producto">Producto</Label>
            <Select name="productoId" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el producto" />
              </SelectTrigger>
              <SelectContent>
                {productos.length === 0 ? (
                  <div className="p-2 text-sm text-slate-500 text-center">
                    No hay productos creados.
                  </div>
                ) : (
                  productos.map((prod) => (
                    <SelectItem key={prod.id} value={prod.id}>
                      {prod.nombre}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {productos.length === 0 && (
              <p className="text-xs text-red-500">
                ⚠️ Primero debes crear productos en la sección Inventario.
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cantidad">Cantidad</Label>
            <Input
              name="cantidad"
              type="number"
              min="1"
              defaultValue="1"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="costo">Costo Unitario Estimado (C$)</Label>
            <Input
              name="costo"
              type="number"
              step="0.01"
              placeholder="Opcional"
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="bg-pink-600 hover:bg-pink-700"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Entrada
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
