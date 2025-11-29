"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Percent, Loader2, Tag } from "lucide-react";
import { toast } from "sonner";
import { aplicarDescuentoMasivo } from "@/actions/liquidacion-actions";

type Producto = {
  id: string;
  nombre: string;
  precioVenta: number;
  descuento: number;
  stock: number;
};

export default function TablaLiquidacion({ productos }: { productos: Producto[] }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [descuentoInput, setDescuentoInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const productosFiltrados = productos.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === productosFiltrados.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(productosFiltrados.map(p => p.id));
    }
  };

  const handleAplicar = async () => {
    const val = Number(descuentoInput);
    if (selectedIds.length === 0) return toast.error("Selecciona productos primero");
    
    setLoading(true);
    try {
      await aplicarDescuentoMasivo(selectedIds, val);
      toast.success("Descuentos actualizados");
      setSelectedIds([]);
      setDescuentoInput("");
    } catch (e) {
      toast.error("Error al actualizar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-4 rounded-lg border shadow-sm">
        
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Buscar productos..." 
            className="pl-8" 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative">
            <Percent className="absolute left-2 top-2.5 h-4 w-4 text-pink-600" />
            <Input 
              type="number" 
              placeholder="% Desc." 
              className="pl-8 w-32" 
              min="0" max="100"
              value={descuentoInput}
              onChange={(e) => setDescuentoInput(e.target.value)}
            />
          </div>
          <Button 
            className="bg-pink-600 hover:bg-pink-700 whitespace-nowrap"
            onClick={handleAplicar}
            disabled={loading || selectedIds.length === 0}
          >
            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Aplicar a Selección"}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-700 font-semibold border-b">
            <tr>
              <th className="p-4 w-10">
                <Checkbox 
                  checked={selectedIds.length > 0 && selectedIds.length === productosFiltrados.length}
                  onCheckedChange={handleSelectAll}
                />
              </th>
              <th className="p-4">Producto</th>
              <th className="p-4 text-center">Precio Original</th>
              <th className="p-4 text-center">Descuento Actual</th>
              <th className="p-4 text-center">Precio Final</th>
              <th className="p-4 text-center">Estado</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-slate-500">No se encontraron productos</td></tr>
            ) : (
              productosFiltrados.map((prod) => {
                const precioFinal = prod.precioVenta * (1 - prod.descuento / 100);
                const isSelected = selectedIds.includes(prod.id);

                return (
                  <tr key={prod.id} className={`border-b hover:bg-slate-50 transition-colors ${isSelected ? 'bg-pink-50/50' : ''}`}>
                    <td className="p-4">
                      <Checkbox 
                        checked={isSelected}
                        onCheckedChange={() => toggleSelect(prod.id)}
                      />
                    </td>
                    <td className="p-4 font-medium">{prod.nombre}</td>
                    <td className="p-4 text-center text-slate-500">C$ {prod.precioVenta.toFixed(2)}</td>
                    <td className="p-4 text-center">
                      {prod.descuento > 0 ? (
                        <Badge className="bg-red-500 hover:bg-red-600">-{prod.descuento}%</Badge>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="p-4 text-center font-bold text-slate-900">
                      C$ {precioFinal.toFixed(2)}
                    </td>
                    <td className="p-4 text-center">
                      {prod.descuento > 0 && (
                        <span className="flex items-center justify-center gap-1 text-xs font-bold text-red-600 animate-pulse">
                          <Tag className="h-3 w-3" /> LIQUIDACIÓN
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}