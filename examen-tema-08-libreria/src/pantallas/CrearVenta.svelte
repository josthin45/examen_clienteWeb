<script lang="ts">
  import { onMount } from 'svelte';
  import { obtenerFuenteDatos } from '../datos';
  import type { Cliente, Libro, NuevaVenta } from '../dominio';
  import { evaluarReglaCreacion } from '../dominio/validaciones';

  let libros: Libro[] = [];
  let clientes: Cliente[] = [];
  let fuente = 'memoria';
  let cargando = true;
  let libroSeleccionadoId: number | null = null;
  let clienteSeleccionadoId: number | null = null;
  let cantidad = 1;
  let mensaje = '';
  let resultado: ReturnType<typeof evaluarReglaCreacion> | null = null;
  let creando = false;

  const libroActivo = (libro: Libro | undefined) => !!libro?.activo;
  const clienteSeleccionado = (clienteId: number | null) => clienteId !== null;

  async function cargarDatos() {
    cargando = true;
    const datos = await obtenerFuenteDatos();
    fuente = import.meta.env?.VITE_FUENTE_DATOS ?? 'memoria';
    libros = await datos.listarLibros();
    clientes = await datos.listarClientes();
    cargando = false;
  }

  $: libroSeleccionado = libros.find((libro) => libro.id === libroSeleccionadoId);
  $: resultado = evaluarReglaCreacion({
    precioUnitario: libroSeleccionado?.precioUnitario ?? 0,
    disponibles: libroSeleccionado?.disponibles ?? 0,
    cantidad,
    clienteSeleccionado: clienteSeleccionado(clienteSeleccionadoId),
    libroActivo: libroActivo(libroSeleccionado),
  });
  $: mensaje = resultado?.mensaje ?? '';

  async function registrar() {
    if (!resultado?.valido || !libroSeleccionado || !clienteSeleccionadoId) {
      return;
    }

    creando = true;
    const datos = await obtenerFuenteDatos();
    const nuevaVenta: NuevaVenta = {
      libroId: libroSeleccionado.id,
      clienteId: clienteSeleccionadoId,
      cantidad,
    };

    try {
      await datos.crearVenta(nuevaVenta);
      await cargarDatos();
      libroSeleccionadoId = null;
      clienteSeleccionadoId = null;
      cantidad = 1;
      mensaje = 'Venta registrada correctamente.';
    } catch (error) {
      mensaje = error instanceof Error ? error.message : 'No se pudo registrar la venta.';
    } finally {
      creando = false;
    }
  }

  onMount(() => {
    cargarDatos();
  });
</script>

<div class="pantalla">
  <header class="cabecera">
    <div>
      <p class="eyebrow">Checkpoint 2</p>
      <h1>Crear venta</h1>
      <p class="subtitulo">Validación en vivo de reglas de negocio</p>
    </div>
    <span class="fuente">Fuente activa: {fuente}</span>
  </header>

  {#if cargando}
    <div class="estado">Cargando datos...</div>
  {:else}
    <div class="contenido-grid">
      <form class="formulario" on:submit|preventDefault={registrar}>
        <label>
          <span>Libro</span>
          <select bind:value={libroSeleccionadoId}>
            <option value={null}>Seleccione un libro</option>
            {#each libros as libro}
              <option value={libro.id}>
                {libro.nombre} {#if !libro.activo} (Inactivo){/if}
              </option>
            {/each}
          </select>
        </label>

        <label>
          <span>Cliente</span>
          <select bind:value={clienteSeleccionadoId}>
            <option value={null}>Seleccione un cliente</option>
            {#each clientes as cliente}
              <option value={cliente.id}>{cliente.nombre}</option>
            {/each}
          </select>
        </label>

        <label>
          <span>Cantidad</span>
          <input type="number" bind:value={cantidad} min="1" />
        </label>

        <button type="submit" disabled={!resultado?.valido || creando}>
          {creando ? 'Registrando...' : 'Registrar venta'}
        </button>
      </form>

      <aside class="resumen">
        <div class="resumen-titulo">Resumen</div>
        <div class="metricas">
          <div class="meta">
            <span>Quedan</span>
            <strong>{resultado?.quedan ?? 0}</strong>
          </div>
          <div class="meta">
            <span>Total</span>
            <strong>${resultado?.total?.toFixed(2) ?? '0.00'}</strong>
          </div>
        </div>
        <p class="mensaje" class:ok={resultado?.valido} class:error={!resultado?.valido}>
          {mensaje || 'Seleccione un libro, cliente y cantidad para ver la validación.'}
        </p>
      </aside>
    </div>
  {/if}
</div>

<style>
  .pantalla {
    padding: 28px;
    background: linear-gradient(135deg, #ffffff 0%, #f8fbff 100%);
    border-radius: 24px;
    box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
    border: 1px solid #e2e8f0;
  }

  .cabecera {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    gap: 16px;
  }

  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.24em;
    color: #64748b;
    font-size: 0.78rem;
    margin: 0 0 4px;
    font-weight: 700;
  }

  h1, p { margin: 0; }

  .subtitulo { color: #64748b; margin-top: 6px; }

  .fuente {
    background: linear-gradient(135deg, #0f172a, #1e293b);
    color: white;
    padding: 9px 14px;
    border-radius: 999px;
    font-size: 0.9rem;
    white-space: nowrap;
  }

  .estado {
    padding: 16px;
    border-radius: 14px;
    background: #f8fafc;
    color: #475569;
  }

  .contenido-grid {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 20px;
    align-items: start;
  }

  .formulario {
    display: grid;
    gap: 14px;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 18px;
    padding: 18px;
  }

  label {
    display: grid;
    gap: 8px;
    font-weight: 600;
    color: #334155;
  }

  select, input, button {
    padding: 11px 12px;
    border-radius: 12px;
    border: 1px solid #cbd5e1;
    font: inherit;
    outline: none;
  }

  select:focus, input:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }

  button {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    color: white;
    cursor: pointer;
    font-weight: 700;
    border: none;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }

  button:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(37, 99, 235, 0.25);
  }

  button:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  .resumen {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 18px;
    padding: 18px;
    display: grid;
    gap: 12px;
  }

  .resumen-titulo {
    font-weight: 700;
    color: #0f172a;
    font-size: 1rem;
  }

  .metricas {
    display: grid;
    gap: 10px;
  }

  .meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 12px;
    background: white;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
  }

  .mensaje {
    padding: 12px;
    border-radius: 12px;
    background: #eff6ff;
    color: #1d4ed8;
    line-height: 1.45;
  }

  .mensaje.ok {
    background: #ecfdf3;
    color: #047857;
  }

  .mensaje.error {
    background: #fef2f2;
    color: #b91c1c;
  }

  @media (max-width: 800px) {
    .contenido-grid {
      grid-template-columns: 1fr;
    }

    .cabecera {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
