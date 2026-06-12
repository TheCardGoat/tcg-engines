/**
 * Server-only site configuration (canonical origin, etc.).
 * Used for OpenGraph, canonical URLs, and JSON-LD.
 */
import { env } from "$env/dynamic/private";

/**
 * Returns the public origin for the site (e.g. https://tcg.online).
 * Uses ORIGIN when set, otherwise the request origin.
 */
export function getPublicOrigin(url: URL): string {
  return env.ORIGIN ?? url.origin;
}
