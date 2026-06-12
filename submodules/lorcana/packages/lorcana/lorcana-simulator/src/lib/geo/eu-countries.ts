/**
 * Country-code helpers for GDPR-strict consent gating.
 *
 * Source of country data: Cloudflare's `cf-ipcountry` request header (ISO 3166-1
 * alpha-2). Cloudflare may also return `XX` for unknown / `T1` for Tor exits —
 * both are treated as unknown.
 */

/**
 * EU member states + EEA (Iceland, Liechtenstein, Norway) + UK. We include the
 * UK because the UK GDPR mirrors the EU GDPR's consent rules and it's safer to
 * apply the strict default than to maintain two near-identical lists.
 */
export const GDPR_STRICT_COUNTRIES: ReadonlySet<string> = new Set([
  // EU
  "AT",
  "BE",
  "BG",
  "HR",
  "CY",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "HU",
  "IE",
  "IT",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE",
  // EEA
  "IS",
  "LI",
  "NO",
  // UK (UK GDPR)
  "GB",
]);

/**
 * `true` when the country falls under EU/EEA/UK GDPR. Returns `false` for known
 * non-GDPR countries and unknown values (`XX`, `T1`, missing header). Callers
 * that want a fail-closed posture for unknowns should check separately.
 */
export function isGdprStrictCountry(country: string | null | undefined): boolean {
  if (!country) return false;
  return GDPR_STRICT_COUNTRIES.has(country.toUpperCase());
}

/**
 * Normalize a raw `cf-ipcountry` value to a clean ISO code or `null`.
 * Cloudflare-only sentinels (`XX`, `T1`) are surfaced as `null` because they
 * carry no meaningful location info.
 */
export function normalizeCfCountry(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const upper = raw.toUpperCase();
  if (upper === "XX" || upper === "T1" || upper.length !== 2) return null;
  return upper;
}
