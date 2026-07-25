import type { FuenteDatos } from "./contrato";
import type { Cliente, Libro, NuevaVenta, NuevoCliente, Venta } from "../dominio";
import semillas from "../../mock/semillas.json";

const librosBase: Libro[] = (semillas.libros as Libro[]).map((libro) => ({ ...libro }));
const clientesBase: Cliente[] = (semillas.clientes as Cliente[]).map((cliente) => ({ ...cliente }));
const ventasBase: Venta[] = (semillas.ventas as Venta[]).map((venta) => ({ ...venta }));

let libros = librosBase.map((libro) => ({ ...libro }));
let clientes = clientesBase.map((cliente) => ({ ...cliente }));
let ventas = ventasBase.map((venta) => ({ ...venta }));

const pendiente = () => Promise.reject(new Error("no implementado"));

export const fuenteMemoria: FuenteDatos = {
  listarLibros: async () => libros.map((libro) => ({ ...libro })),
  listarClientes: async () => clientes.map((cliente) => ({ ...cliente })),
  crearCliente: async (datos: NuevoCliente) => {
    const cliente: Cliente = {
      id: clientes.length + 1,
      ...datos,
    };
    clientes = [...clientes, cliente];
    return { ...cliente };
  },
  listarVentas: async () => ventas.map((venta) => ({ ...venta })),
  crearVenta: async (datos: NuevaVenta) => {
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
