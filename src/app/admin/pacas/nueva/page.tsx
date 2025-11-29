"use client";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { crearPaca } from "@/actions/pacas-actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function NuevaPacaPage() {
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSaving(true);
    try {
      await crearPaca(formData);
      toast.success("Paca registrada correctamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar. Revisa los datos.");
      setIsSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/pacas"
          className="text-sm text-slate-500 hover:text-pink-600 hover:underline"
        >
          ← Volver al listado
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registrar Nueva Paca</CardTitle>
          <CardDescription>
            Ingresa los datos de la compra para iniciar el inventario.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre de la Paca</Label>
              <Input
                id="nombre"
                name="nombre"
                placeholder="Ej: Paca Mixta Premium Noviembre"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="costo">Costo Total (C$)</Label>
                <Input
                  id="costo"
                  name="costo"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha de Compra</Label>
                <Input
                  id="fecha"
                  name="fecha"
                  type="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción / Notas</Label>
              <Textarea
                id="descripcion"
                name="descripcion"
                placeholder="Detalles sobre el proveedor o contenido..."
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" asChild type="button">
                <Link href="/admin/pacas">Cancelar</Link>
              </Button>

              <Button
                type="submit"
                className="bg-pink-600 hover:bg-pink-700"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Guardando...
                  </>
                ) : (
                  "Guardar Paca"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
