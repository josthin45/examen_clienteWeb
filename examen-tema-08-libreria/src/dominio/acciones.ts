import type { Cliente, Libro, Venta } from './index';

export interface EstadoVenta {
  estado: Venta['estado'];
  puedeCancelar: boolean;
  badge: string;
}

export function obtenerEstadoVenta(venta: Venta): EstadoVenta {
  if (venta.estado === 'PENDIENTE') {
    return { estado: venta.estado, puedeCancelar: true, badge: 'Pendiente' };
  }

  if (venta.estado === 'FACTURADA') {
    return { estado: venta.estado, puedeCancelar: false, badge: 'Facturada' };
  }

  return { estado: venta.estado, puedeCancelar: false, badge: 'Anulada' };
}

export function encontrarLibro(libros: Libro[], id: number | undefined): Libro | undefined {
  return libros.find((libro) => libro.id === id);
}

export function encontrarCliente(clientes: Cliente[], id: number | undefined): Cliente | undefined {
  return clientes.find((cliente) => cliente.id === id);
}
