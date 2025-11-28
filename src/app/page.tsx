import { PrismaClient } from "@prisma/client";

// Instancia de Prisma (esto conecta con la BD)
const prisma = new PrismaClient();

export default async function Home() {
  // 1. CONSULTA A LA BASE DE DATOS
  // Buscamos todos los productos
  const productos = await prisma.producto.findMany();

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">Sistema Tienda Isela</h1>

      <section>
        <h2 className="text-xl font-semibold mb-4">Inventario de Prueba</h2>

        {/* Si no hay productos, mostramos aviso */}
        {productos.length === 0 ? (
          <p className="text-gray-500">No hay productos registrados aún.</p>
        ) : (
          /* 2. RENDERIZADO DE LOS DATOS */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {productos.map((producto) => (
              <div
                key={producto.id}
                className="border p-4 rounded shadow bg-white"
              >
                <h3 className="font-bold text-lg">{producto.nombre}</h3>
                <p className="text-gray-600">
                  Precio: C$ {Number(producto.precioVenta)}
                </p>
                <p className="text-sm mt-2">
                  Stock:{" "}
                  <span
                    className={
                      producto.stock > 0 ? "text-green-600" : "text-red-600"
                    }
                  >
                    {producto.stock} unidades
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
