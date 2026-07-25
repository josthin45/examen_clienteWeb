import { describe, expect, it } from 'vitest';
import { evaluarReglaCreacion } from './validaciones';

describe('evaluarReglaCreacion', () => {
  it('calcula el total con descuento a partir de 5 unidades', () => {
    const resultado = evaluarReglaCreacion({
      precioUnitario: 8.5,
      disponibles: 10,
      cantidad: 5,
      clienteSeleccionado: true,
      libroActivo: true,
    });

    expect(resultado.total).toBe(38.25);
    expect(resultado.descuentoAplicado).toBe(true);
    expect(resultado.valido).toBe(true);
  });

  it('bloquea la creación cuando la cantidad supera la disponibilidad', () => {
    const resultado = evaluarReglaCreacion({
      precioUnitario: 8.5,
      disponibles: 3,
      cantidad: 4,
      clienteSeleccionado: true,
      libroActivo: true,
    });

    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('disponibilidad');
  });

  it('requiere un cliente para registrar', () => {
    const resultado = evaluarReglaCreacion({
      precioUnitario: 8.5,
      disponibles: 10,
      cantidad: 3,
      clienteSeleccionado: false,
      libroActivo: true,
    });

    expect(resultado.valido).toBe(false);
    expect(resultado.mensaje).toContain('cliente');
  });
});
