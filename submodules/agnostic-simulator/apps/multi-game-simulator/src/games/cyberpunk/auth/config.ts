import { normalizeAuthBaseUrl as normalizeSharedAuthBaseUrl } from "@tcg/simulator-runtime/auth";
import { gameApiBaseUrl } from "../../../runtime/gameRuntimeApi";
import { CYBERPUNK_GAME_SLUG } from "../engine/live/apiOrigin";

export function normalizeAuthBaseUrl(apiUrl: string | undefined): string {
  if (!apiUrl?.trim() && import.meta.env.PROD) {
    throw new Error(
      "VITE_AUTH_BASE_URL, VITE_GAME_RUNTIME_API_URLS, or VITE_API_URL must be configured in production.",
    );
  }

  return normalizeSharedAuthBaseUrl(apiUrl, "http://localhost:3000");
}

export function getAuthBaseUrl(): string {
  return normalizeAuthBaseUrl(
    import.meta.env.VITE_AUTH_BASE_URL ?? gameApiBaseUrl(CYBERPUNK_GAME_SLUG),
  );
}
