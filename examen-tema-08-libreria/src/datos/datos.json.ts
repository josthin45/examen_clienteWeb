import type { FuenteDatos } from "./contrato";
import type { Cliente, Libro, NuevaVenta, NuevoCliente, Venta } from "../dominio";
import { RUTA_SEMILLAS_JSON } from "./configuracion";

let libros: Libro[] = [];
let clientes: Cliente[] = [];
let ventas: Venta[] = [];

async function cargarSemillas() {
  const respuesta = await fetch(RUTA_SEMILLAS_JSON, { cache: 'no-store' });
  const semillas = await respuesta.json();
  libros = semillas.libros.map((libro: Libro) => ({ ...libro }));
  clientes = semillas.clientes.map((cliente: Cliente) => ({ ...cliente }));
  ventas = semillas.ventas.map((venta: Venta) => ({ ...venta }));
}

export const fuenteJson: FuenteDatos = {
  listarLibros: async () => {
    await cargarSemillas();
    return libros.map((libro) => ({ ...libro }));
  },
  listarClientes: async () => {
    await cargarSemillas();
    return clientes.map((cliente) => ({ ...cliente }));
  },
  crearCliente: async (datos: NuevoCliente) => {
    await cargarSemillas();
    const cliente: Cliente = { id: clientes.length + 1, ...datos };
    clientes = [...clientes, cliente];
    return { ...cliente };
  },
  listarVentas: async () => {
    await cargarSemillas();
    return ventas.map((venta) => ({ ...venta }));
  },
  crearVenta: async (datos: NuevaVenta) => {
    await cargarSemillas();
    const libro = libros.find((item) => item.id === datos.libroId);
    const cliente = clientes.find((item) => item.id === datos.clienteId);
    if (!libro || !cliente) {
      throw new Error("El libro o el cliente no existe");
    }
    if (!libro.activo) {
      throw new Error("El libro no está activo");
    }
    if (datos.cantidad > libro.disponibles) {
      throw new Error("La cantidad supera la disponibilidad");
    }
    const descuentoAplicado = datos.cantidad >= 5;
    const total = datos.cantidad * libro.precioUnitario * (descuentoAplicado ? 0.9 : 1);
    const venta: Venta = {
      id: ventas.length + 1,
      libroId: datos.libroId,
      clienteId: datos.clienteId,
      cantidad: datos.cantidad,
      total: Number(total.toFixed(2)),
      descuentoAplicado,
      estado: "PENDIENTE",
    };
    ventas = [...ventas, venta];
    libro.disponibles -= datos.cantidad;
    return { ...venta };
  },
  anularVenta: async (id: number) => {
    await cargarSemillas();
    const venta = ventas.find((item) => item.id === id);
    if (!venta) {
      throw new Error("La venta no existe");
    }
    if (venta.estado !== "PENDIENTE") {
      throw new Error("Solo se pueden anular ventas pendientes");
    }
    const libro = libros.find((item) => item.id === venta.libroId);
    if (libro) {
      libro.disponibles += venta.cantidad;
    }
    venta.estado = "ANULADA";
    return { ...venta };
  },
};
