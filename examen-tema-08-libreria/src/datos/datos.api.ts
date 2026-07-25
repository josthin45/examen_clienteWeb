import type { FuenteDatos } from "./contrato";
import type { Cliente, Libro, NuevaVenta, NuevoCliente, Venta } from "../dominio";
import { URL_API } from "./configuracion";

async function pedir<T>(ruta: string, init?: RequestInit): Promise<T> {
  const respuesta = await fetch(`${URL_API}${ruta}`, init);
  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status}`);
  }
  return respuesta.json() as Promise<T>;
}

export const fuenteApi: FuenteDatos = {
  listarLibros: async () => pedir<Libro[]>("/libros"),
  listarClientes: async () => pedir<Cliente[]>("/clientes"),
  crearCliente: async (datos: NuevoCliente) =>
    pedir<Cliente>("/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    }),
  listarVentas: async () => pedir<Venta[]>("/ventas"),
  crearVenta: async (datos: NuevaVenta) =>
    pedir<Venta>("/ventas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    }),
  anularVenta: async (id: number) =>
    pedir<Venta>(`/ventas/${id}`, {
      method: "PATCH",
    }),
};
