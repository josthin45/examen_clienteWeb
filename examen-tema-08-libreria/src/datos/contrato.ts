import type {
  Libro,
  Cliente,
  NuevoCliente,
  Venta,
  NuevaVenta,
} from "../dominio";

export interface FuenteDatos {
  listarLibros(): Promise<Libro[]>;
  listarClientes(): Promise<Cliente[]>;
  crearCliente(datos: NuevoCliente): Promise<Cliente>;
  listarVentas(): Promise<Venta[]>;
  crearVenta(datos: NuevaVenta): Promise<Venta>;
  anularVenta(id: number): Promise<Venta>;
}
