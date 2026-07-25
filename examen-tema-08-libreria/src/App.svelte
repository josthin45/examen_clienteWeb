<script lang="ts">
  import DetalleVentas from './pantallas/DetalleVentas.svelte';
</script>

<svelte:head>
  <title>Librería Páginas</title>
</svelte:head>

<div class="app-shell">
  <header class="cabecera">
    <div>
      <p class="eyebrow">Temática 08</p>
      <h1>Librería Páginas</h1>
      <p class="subtitulo">Sistema de ventas</p>
    </div>
  </header>

  <main class="contenido">
    <DetalleVentas />
  </main>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: Inter, system-ui, sans-serif;
    background: #f4f7fb;
    color: #162033;
  }

  :global(*) {
    box-sizing: border-box;
  }

  .app-shell {
    min-height: 100vh;
    padding: 24px;
  }

  .cabecera {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .eyebrow {
    margin: 0 0 4px;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #64748b;
    font-size: 0.8rem;
  }

  h1, p {
    margin: 0;
  }

  .subtitulo {
    color: #64748b;
    margin-top: 4px;
  }

  .contenido {
    display: grid;
    gap: 24px;
  }
</style>
