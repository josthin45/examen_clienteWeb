<script lang="ts">
  import { onMount } from 'svelte';
  import { obtenerFuenteDatos } from '../datos';
  import type { Cliente, Libro, Venta, NuevoCliente } from '../dominio';
  import { encontrarCliente, encontrarLibro, obtenerEstadoVenta } from '../dominio/acciones';

  let libros: Libro[] = [];
  let clientes: Cliente[] = [];
  let ventas: Venta[] = [];
  let fuente = 'memoria';
  let cargando = true;
  let creandoCliente = false;
  let nombreCliente = '';
  let cedulaCliente = '';
  let telefonoCliente = '';
  let mensaje = '';

  async function cargarDatos() {
    cargando = true;
    const datos = await obtenerFuenteDatos();
    fuente = import.meta.env?.VITE_FUENTE_DATOS ?? 'memoria';
    [libros, clientes, ventas] = await Promise.all([
      datos.listarLibros(),
      datos.listarClientes(),
      datos.listarVentas(),
    ]);
    cargando = false;
  }

  async function cancelarVenta(venta: Venta) {
    const datos = await obtenerFuenteDatos();
    try {
      await datos.anularVenta(venta.id);
      await cargarDatos();
      mensaje = 'Venta anulada correctamente.';
    } catch (error) {
      mensaje = error instanceof Error ? error.message : 'No se pudo anular la venta.';
    }
  }

  async function registrarCliente() {
    if (!nombreCliente.trim() || !cedulaCliente.trim() || !telefonoCliente.trim()) {
      mensaje = 'Complete todos los campos del cliente.';
      return;
    }

    creandoCliente = true;
    const datos = await obtenerFuenteDatos();
    const nuevoCliente: NuevoCliente = {
      nombre: nombreCliente.trim(),
      cedula: cedulaCliente.trim(),
      telefono: telefonoCliente.trim(),
    };

    try {
      await datos.crearCliente(nuevoCliente);
      nombreCliente = '';
      cedulaCliente = '';
      telefonoCliente = '';
      await cargarDatos();
      mensaje = 'Cliente creado correctamente.';
    } catch (error) {
      mensaje = error instanceof Error ? error.message : 'No se pudo crear el cliente.';
    } finally {
      creandoCliente = false;
    }
  }

  onMount(() => {
    cargarDatos();
  });
</script>

<div class="pantalla">
  <header class="cabecera">
    <div>
      <p class="eyebrow">Checkpoint 3</p>
      <h1>Detalle de ventas</h1>
      <p class="subtitulo">Cancelación, reposición y creación de clientes</p>
    </div>
    <span class="fuente">Fuente activa: {fuente}</span>
  </header>

  {#if cargando}
    <div class="estado">Cargando datos...</div>
  {:else}
    <div class="contenido-grid">
      <section class="panel">
        <div class="panel-title">Ventas</div>
        <div class="lista">
          {#each ventas as venta}
            {@const libro = encontrarLibro(libros, venta.libroId)}
            {@const cliente = encontrarCliente(clientes, venta.clienteId)}
            {@const estado = obtenerEstadoVenta(venta)}
            <article class="item">
              <div class="item-header">
                <strong>{libro?.nombre ?? 'Libro no disponible'}</strong>
                <span class={`badge ${estado.badge.toLowerCase()}`}>{estado.badge}</span>
              </div>
              <p>Cliente: {cliente?.nombre ?? 'Sin cliente'}</p>
              <p>Cantidad: {venta.cantidad}</p>
              <p>Total: ${venta.total.toFixed(2)}</p>
              <div class="item-actions">
                <button class="secondary" disabled={!estado.puedeCancelar} on:click={() => cancelarVenta(venta)}>
                  Cancelar
                </button>
              </div>
            </article>
          {/each}
        </div>
      </section>

      <section class="panel">
        <div class="panel-title">Nuevo cliente</div>
        <form class="formulario" on:submit|preventDefault={registrarCliente}>
          <label>
            <span>Nombre</span>
            <input bind:value={nombreCliente} placeholder="Nombre completo" />
          </label>
          <label>
            <span>Cédula</span>
            <input bind:value={cedulaCliente} placeholder="Cédula" />
          </label>
          <label>
            <span>Teléfono</span>
            <input bind:value={telefonoCliente} placeholder="Teléfono" />
          </label>
          <button type="submit" disabled={creandoCliente}>
            {creandoCliente ? 'Creando...' : '+ Nuevo cliente'}
          </button>
        </form>
        {#if mensaje}
          <p class="mensaje">{mensaje}</p>
        {/if}
      </section>
    </div>
  {/if}
</div>

<style>
  .pantalla { padding: 28px; background: linear-gradient(135deg, #ffffff 0%, #f8fbff 100%); border-radius: 24px; box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08); border: 1px solid #e2e8f0; }
  .cabecera { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; gap: 16px; }
  .eyebrow { text-transform: uppercase; letter-spacing: 0.24em; color: #64748b; font-size: 0.78rem; margin: 0 0 4px; font-weight: 700; }
  h1, p { margin: 0; }
  .subtitulo { color: #64748b; margin-top: 6px; }
  .fuente { background: linear-gradient(135deg, #0f172a, #1e293b); color: white; padding: 9px 14px; border-radius: 999px; font-size: 0.9rem; white-space: nowrap; }
  .estado { padding: 16px; border-radius: 14px; background: #f8fafc; color: #475569; }
  .contenido-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 20px; align-items: start; }
  .panel { background: white; border: 1px solid #e2e8f0; border-radius: 18px; padding: 18px; display: grid; gap: 12px; }
  .panel-title { font-weight: 700; color: #0f172a; }
  .lista { display: grid; gap: 12px; }
  .item { border: 1px solid #e2e8f0; border-radius: 14px; padding: 12px; display: grid; gap: 6px; }
  .item-header { display: flex; justify-content: space-between; gap: 12px; align-items: center; }
  .badge { padding: 5px 9px; border-radius: 999px; font-size: 0.78rem; font-weight: 700; }
  .badge.pendiente { background: #eff6ff; color: #1d4ed8; }
  .badge.facturada { background: #ecfdf3; color: #047857; }
  .badge.anulada { background: #fef2f2; color: #b91c1c; }
  .formulario { display: grid; gap: 12px; }
  label { display: grid; gap: 6px; font-weight: 600; color: #334155; }
  input, button { padding: 10px 12px; border-radius: 12px; border: 1px solid #cbd5e1; font: inherit; }
  button { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; cursor: pointer; border: none; }
  button.secondary { background: #f1f5f9; color: #0f172a; border: 1px solid #cbd5e1; }
  button:disabled { opacity: 0.6; cursor: not-allowed; }
  .mensaje { padding: 10px 12px; background: #eff6ff; border-radius: 12px; color: #1d4ed8; }
  @media (max-width: 800px) { .contenido-grid { grid-template-columns: 1fr; } .cabecera { flex-direction: column; align-items: flex-start; } }
</style>
