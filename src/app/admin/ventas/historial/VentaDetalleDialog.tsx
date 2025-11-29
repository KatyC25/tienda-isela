"use client";

import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Detalle = {
  id: string;
  cantidad: number;
  precioVenta: any;
  producto: {
    nombre: string;
  };
};

type VentaProps = {
  id: string;
  fecha: Date;
  total: any;
  detalles: Detalle[];
};

export default function VentaDetalleDialog({ venta }: { venta: VentaProps }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Eye className="h-4 w-4 text-slate-500" />
          <span className="sr-only">Ver detalle</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Detalle de Venta</DialogTitle>
          <p className="text-sm text-slate-500">
            {new Date(venta.fecha).toLocaleString("es-NI")}
          </p>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-4">
            {venta.detalles.map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-sm border-b border-dashed pb-2"
              >
                <div>
                  <span className="font-bold">{item.cantidad} x </span>
                  <span>{item.producto.nombre}</span>
                </div>
                <div className="text-right">
                  C$ {(Number(item.precioVenta) * item.cantidad).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center pt-4 border-t border-slate-900">
            <span className="font-bold text-lg">TOTAL</span>
            <span className="font-black text-xl">
              C$ {Number(venta.total).toFixed(2)}
            </span>
          </div>

          <div className="mt-2 text-center">
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold">
              PAGADO (Efectivo)
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
