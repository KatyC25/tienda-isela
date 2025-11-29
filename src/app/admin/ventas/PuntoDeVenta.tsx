"use client";

import {
  Loader2,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { registrarVenta } from "@/actions/ventas-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Producto = {
  id: string;
  nombre: string;
  precioVenta: any;
  stock: number;
  descuento: number;
};

type CartItem = Producto & { cantidadCarrito: number; precioFinal: number };

export default function PuntoDeVenta({ productos }: { productos: Producto[] }) {
  const [busqueda, setBusqueda] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const productosFiltrados = useMemo(() => {
    return productos.filter((p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()),
    );
  }, [productos, busqueda]);

  const addToCart = (producto: Producto) => {
    const precioConDescuento =
      producto.precioVenta * (1 - producto.descuento / 100);

    setCart((prev) => {
      const existe = prev.find((item) => item.id === producto.id);

      if (existe) {
        if (existe.cantidadCarrito >= producto.stock) {
          toast.warning("No hay más stock disponible");
          return prev;
        }
        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, cantidadCarrito: item.cantidadCarrito + 1 }
            : item,
        );
      }

      return [
        ...prev,
        { ...producto, cantidadCarrito: 1, precioFinal: precioConDescuento },
      ];
    });
  };
  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nuevaCantidad = item.cantidadCarrito + delta;
          if (nuevaCantidad < 1) return item;
          if (nuevaCantidad > item.stock) {
            toast.warning("Stock máximo alcanzado");
            return item;
          }
          return { ...item, cantidadCarrito: nuevaCantidad };
        }
        return item;
      }),
    );
  };

  const total = cart.reduce(
    (sum, item) => sum + item.precioFinal * item.cantidadCarrito,
    0,
  );

  const handleCobrar = async () => {
    setLoading(true);
    try {
      const itemsVenta = cart.map((item) => ({
        productoId: item.id,
        cantidad: item.cantidadCarrito,
        precio: item.precioFinal,
      }));

      await registrarVenta(itemsVenta, total);

      toast.success(`Venta registrada: C$ ${total.toFixed(2)}`);
      setCart([]);
      setBusqueda("");
    } catch (error: any) {
      toast.error(error.message || "Error al procesar venta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)]">
      <div className="flex-1 flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar producto..."
            className="pl-9 h-12 text-lg"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            autoFocus
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {productosFiltrados.map((prod) => {
              const precioCalculado =
                prod.precioVenta * (1 - prod.descuento / 100);

              return (
                <Card
                  key={prod.id}
                  className={`cursor-pointer transition-all hover:shadow-md hover:border-pink-300 ${prod.stock === 0 ? "opacity-50 grayscale" : ""}`}
                  onClick={() => prod.stock > 0 && addToCart(prod)}
                >
                  <CardContent className="p-4 flex flex-col justify-between h-full">
                    <div>
                      <h3 className="font-semibold text-slate-800 line-clamp-2">
                        {prod.nombre}
                      </h3>

                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        {prod.descuento > 0 ? (
                          <>
                            <span className="text-xs text-slate-400 line-through">
                              C$ {prod.precioVenta}
                            </span>
                            <span className="text-pink-600 font-bold">
                              C$ {precioCalculado.toFixed(2)}
                            </span>
                            <Badge className="h-5 px-1 bg-red-500 text-[10px]">
                              -{prod.descuento}%
                            </Badge>
                          </>
                        ) : (
                          <span className="text-pink-600 font-bold">
                            C$ {prod.precioVenta}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 flex justify-between items-center text-xs text-slate-500">
                      <span>Stock: {prod.stock}</span>
                      {prod.stock > 0 ? (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200"
                        >
                          Disp.
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Agotado</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {productosFiltrados.length === 0 && (
            <div className="text-center text-slate-500 mt-10">
              No se encontraron productos
            </div>
          )}
        </div>
      </div>

      <div className="w-full lg:w-96 bg-white border rounded-xl shadow-sm flex flex-col h-full">
        <div className="p-4 border-b bg-slate-50 rounded-t-xl">
          <h2 className="font-bold flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Ticket de Venta
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
              <ShoppingCart className="h-12 w-12 opacity-20" />
              <p>El carrito está vacío</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between group"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.nombre}</p>
                  <p className="text-xs text-slate-500">
                    C$ {item.precioFinal.toFixed(2)} x unidad
                    {item.descuento > 0 && (
                      <span className="text-red-500 ml-1">
                        (-{item.descuento}%)
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1 mx-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => updateQuantity(item.id, -1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-sm font-bold w-4 text-center">
                    {item.cantidadCarrito}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => updateQuantity(item.id, 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                <div className="text-right">
                  <p className="font-bold text-sm">
                    C$ {(item.precioFinal * item.cantidadCarrito).toFixed(0)}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t rounded-b-xl space-y-4">
          <div className="flex justify-between items-center text-lg">
            <span className="text-slate-600">Total a Pagar:</span>
            <span className="font-black text-2xl text-slate-900">
              C$ {total.toFixed(2)}
            </span>
          </div>

          <Button
            size="lg"
            className="w-full bg-slate-900 hover:bg-slate-800 text-lg h-14"
            disabled={cart.length === 0 || loading}
            onClick={handleCobrar}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Procesando...
              </>
            ) : (
              "COBRAR (Efectivo)"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
