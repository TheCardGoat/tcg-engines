/**
 * Runtime fingerprint headers exchanged with the API.
 *
 * The server-side gundam adapter does not yet implement
 * `getRuntimeFingerprint`, so the API has no version it can compare
 * against. We still send static placeholder headers because:
 *   1) the request path the API uses to read them is shared with
 *      cyberpunk / lorcana and may grow strict checks later;
 *   2) when the gundam adapter starts exporting real hashes, the
 *      server-side mismatch warning will flip on automatically — no
 *      client change required.
 *
 * Replace the placeholder values once `@tcg/gundam-engine` and
 * `@tcg/gundam-cards` start exporting `RUNTIME` constants.
 */
const GUNDAM_ENGINE_HASH = "gundam-engine-dev";
const GUNDAM_CARDS_HASH = "gundam-cards-dev";

export const GUNDAM_CLIENT_RUNTIME_HASH = `${GUNDAM_ENGINE_HASH}.${GUNDAM_CARDS_HASH}`;

export function gundamRuntimeRequestHeaders(): Record<string, string> {
  return {
    "x-tcg-client-runtime": GUNDAM_CLIENT_RUNTIME_HASH,
    "x-tcg-client-engine-runtime": GUNDAM_ENGINE_HASH,
    "x-tcg-client-cards-runtime": GUNDAM_CARDS_HASH,
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
