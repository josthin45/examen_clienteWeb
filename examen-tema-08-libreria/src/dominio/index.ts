export interface Libro {
  id: number;
  nombre: string;
  precioUnitario: number;
  disponibles: number;
  activo: boolean;
}

export interface Cliente {
  id: number;
  nombre: string;
  cedula: string;
  telefono: string;
}

export interface NuevoCliente {
  nombre: string;
  cedula: string;
  telefono: string;
}

export interface Venta {
  id: number;
  libroId: number;
  clienteId: number;
  cantidad: number;
  total: number;
  descuentoAplicado: boolean;
  estado: string;
}

export interface NuevaVenta {
  libroId: number;
  clienteId: number;
  cantidad: number;
}
