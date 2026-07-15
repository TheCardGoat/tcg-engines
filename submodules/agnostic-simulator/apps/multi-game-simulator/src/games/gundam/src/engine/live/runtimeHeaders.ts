import { GUNDAM_CARDS_RUNTIME } from "@tcg/gundam-cards";
import { GUNDAM_ENGINE_RUNTIME } from "@tcg/gundam-engine";

export const GUNDAM_CLIENT_RUNTIME_HASH = `${GUNDAM_ENGINE_RUNTIME.hash}.${GUNDAM_CARDS_RUNTIME.hash}`;

export function gundamRuntimeRequestHeaders(): Record<string, string> {
  return {
    "x-tcg-client-runtime": GUNDAM_CLIENT_RUNTIME_HASH,
    "x-tcg-client-engine-runtime": GUNDAM_ENGINE_RUNTIME.hash,
    "x-tcg-client-cards-runtime": GUNDAM_CARDS_RUNTIME.hash,
  };
}

export function readServerRuntimeHeaders(response: Response): {
  runtime: string | null;
  engine: string | null;
  cards: string | null;
} {
  return {
    runtime: response.headers.get("x-tcg-runtime"),
    engine: response.headers.get("x-tcg-engine-runtime"),
    cards: response.headers.get("x-tcg-cards-runtime"),
  };
}
