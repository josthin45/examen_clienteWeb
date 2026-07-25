export const FUENTE_POR_DEFECTO = "memoria";
export const URL_API = "http://localhost:3000";
export const RUTA_SEMILLAS_JSON = "/semillas.json";

export function leerFuente(): string {
  return import.meta.env?.VITE_FUENTE_DATOS ?? FUENTE_POR_DEFECTO;
}
