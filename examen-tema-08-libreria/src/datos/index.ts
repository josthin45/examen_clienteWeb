import { leerFuente } from "./configuracion";
import { fuenteMemoria } from "./datos.memoria";
import type { FuenteDatos } from "./contrato";

let fuenteActiva: FuenteDatos | null = null;

export async function obtenerFuenteDatos(): Promise<FuenteDatos> {
  if (!fuenteActiva) {
    const fuente = leerFuente();
    switch (fuente) {
      case "json":
        fuenteActiva = (await import("./datos.json")).fuenteJson;
        break;
      case "api":
        fuenteActiva = (await import("./datos.api")).fuenteApi;
        break;
      case "memoria":
      default:
        fuenteActiva = fuenteMemoria;
        break;
    }
  }

  return fuenteActiva;
}
