import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando sembrado de datos (Seeding)...");

  await prisma.detalleVenta.deleteMany();
  await prisma.venta.deleteMany();
  await prisma.prendaPaca.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.paca.deleteMany();

  console.log("🧹 Base de datos limpiada.");

  const productos = await Promise.all([
    prisma.producto.create({
      data: { nombre: "Camisa Premium Caballero", precioVenta: 250, stock: 0 },
    }),
    prisma.producto.create({
      data: { nombre: "Blusa de Seda", precioVenta: 180, stock: 0 },
    }),
    prisma.producto.create({
      data: { nombre: "Jean Americano", precioVenta: 450, stock: 0 },
    }),
    prisma.producto.create({
      data: { nombre: "Vestido de Verano", precioVenta: 320, stock: 0 },
    }),
    prisma.producto.create({
      data: { nombre: "Short Deportivo", precioVenta: 120, stock: 0 },
    }),
    prisma.producto.create({
      data: { nombre: "Chaqueta Lona", precioVenta: 500, stock: 0 },
    }),
  ]);

  console.log("👕 Productos creados.");

  const paca1 = await prisma.paca.create({
    data: {
      nombre: "Paca Mixta Noviembre",
      costoTotal: 5000,
      fechaCompra: new Date(new Date().setDate(new Date().getDate() - 10)),
      descripcion: "Ropa de calidad media-alta",
    },
  });

  const paca2 = await prisma.paca.create({
    data: {
      nombre: "Paca Premium Diciembre",
      costoTotal: 8000,
      fechaCompra: new Date(new Date().setDate(new Date().getDate() - 2)),
      descripcion: "Marcas reconocidas",
    },
  });

  console.log("📦 Pacas creadas.");

  await prisma.prendaPaca.create({
    data: {
      pacaId: paca1.id,
      productoId: productos[0].id,
      cantidad: 20,
      costoUnitarioEstimado: 50,
    },
  });
  await prisma.producto.update({
    where: { id: productos[0].id },
    data: { stock: { increment: 20 } },
  }); // Actualizar stock manual aquí para el seed

  await prisma.prendaPaca.create({
    data: {
      pacaId: paca1.id,
      productoId: productos[2].id,
      cantidad: 15,
      costoUnitarioEstimado: 100,
    },
  });
  await prisma.producto.update({
    where: { id: productos[2].id },
    data: { stock: { increment: 15 } },
  });

  await prisma.prendaPaca.create({
    data: {
      pacaId: paca2.id,
      productoId: productos[1].id,
      cantidad: 30,
      costoUnitarioEstimado: 40,
    },
  });
  await prisma.producto.update({
    where: { id: productos[1].id },
    data: { stock: { increment: 30 } },
  });

  await prisma.prendaPaca.create({
    data: {
      pacaId: paca2.id,
      productoId: productos[3].id,
      cantidad: 10,
      costoUnitarioEstimado: 150,
    },
  });
  await prisma.producto.update({
    where: { id: productos[3].id },
    data: { stock: { increment: 10 } },
  });

  console.log("🏭 Inventario procesado.");

  for (let i = 0; i < 20; i++) {
    const diasAtras = Math.floor(Math.random() * 7);
    const fechaVenta = new Date();
    fechaVenta.setDate(fechaVenta.getDate() - diasAtras);

    const prodRandom = productos[Math.floor(Math.random() * productos.length)];
    const cantidad = Math.floor(Math.random() * 3) + 1;
    const total = Number(prodRandom.precioVenta) * cantidad;

    const venta = await prisma.venta.create({
      data: {
        totalVenta: total,
        fechaVenta: fechaVenta,
        metodoPago: "EFECTIVO",
      },
    });

    await prisma.detalleVenta.create({
      data: {
        ventaId: venta.id,
        productoId: prodRandom.id,
        cantidad: cantidad,
        precioVenta: prodRandom.precioVenta,
      },
    });

    await prisma.producto.update({
      where: { id: prodRandom.id },
      data: { stock: { decrement: cantidad } },
    });
  }

  console.log("💰 Ventas simuladas generadas.");
  console.log("✅ SEEDING COMPLETADO CON ÉXITO");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
