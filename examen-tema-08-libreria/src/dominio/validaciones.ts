export interface ReglaCreacionInput {
  precioUnitario: number;
  disponibles: number;
  cantidad: number;
  clienteSeleccionado: boolean;
  libroActivo: boolean;
}

export interface ReglaCreacionResultado {
  valido: boolean;
  total: number;
  descuentoAplicado: boolean;
  mensaje: string;
  quedan: number;
}

export function evaluarReglaCreacion(input: ReglaCreacionInput): ReglaCreacionResultado {
  const quedan = Math.max(input.disponibles - input.cantidad, 0);
  if (!input.clienteSeleccionado) {
    return {
      valido: false,
      total: 0,
      descuentoAplicado: false,
      mensaje: 'Debe seleccionar un cliente para registrar la venta.',
      quedan,
    };
  }

  if (!input.libroActivo) {
    return {
      valido: false,
      total: 0,
      descuentoAplicado: false,
      mensaje: 'El libro seleccionado no está activo.',
      quedan,
    };
  }

  if (input.cantidad > input.disponibles) {
    return {
      valido: false,
      total: 0,
      descuentoAplicado: false,
      mensaje: 'La cantidad supera la disponibilidad del libro.',
      quedan,
    };
  }

  const descuentoAplicado = input.cantidad >= 5;
  const total = input.cantidad * input.precioUnitario * (descuentoAplicado ? 0.9 : 1);

  return {
    valido: true,
    total: Number(total.toFixed(2)),
    descuentoAplicado,
    mensaje: 'Listo para registrar.',
    quedan,
  };
}
