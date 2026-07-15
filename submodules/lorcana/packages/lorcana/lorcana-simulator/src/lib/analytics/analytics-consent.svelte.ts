/**
 * Reactive analytics consent state using Svelte 5 runes.
 *
 * Persists user choice to localStorage and exposes a singleton
 * for use across the app.
 */

const STORAGE_KEY = "analytics_consent";

/**
 * null = not yet decided, true = granted, false = denied.
 *
 * In permissive jurisdictions, users accept analytics via TOS acceptance
 * during onboarding, so we default to `true` when no explicit preference is
 * stored. Under GDPR-strict mode (EU/EEA/UK visitors as detected by the
 * server's `cf-ipcountry` lookup), we default to `false` and require explicit
 * opt-in via the consent banner.
 */
export const analyticsConsent = $state({
  consentGranted: null as boolean | null,
  /** True when the visitor's jurisdiction requires explicit opt-in (EU/EEA/UK). */
  gdprStrict: false,
  initialize,
  grant,
  deny,
  reset,
});

function loadFromStorage(gdprStrict: boolean): boolean | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "true") return true;
  if (stored === "false") return false;
  // GDPR-strict: leave as null so the banner can prompt for explicit opt-in.
  // gtag's default consent is already "denied" at script load, so no events
  // will fire while we're waiting on the user. Permissive jurisdictions
  // pre-grant via TOS acceptance.
  return gdprStrict ? null : true;
}

function saveToStorage(value: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, String(value));
}

/**
 * Initialize consent state from localStorage. Call once on mount.
 * Pass `gdprStrict: true` for EU/EEA/UK visitors so the default is denied.
 */
function initialize(options: { gdprStrict?: boolean } = {}): void {
  const gdprStrict = options.gdprStrict ?? false;
  analyticsConsent.gdprStrict = gdprStrict;
  analyticsConsent.consentGranted = loadFromStorage(gdprStrict);
}

function grant(): void {
  analyticsConsent.consentGranted = true;
  saveToStorage(true);
}

function deny(): void {
  analyticsConsent.consentGranted = false;
  saveToStorage(false);
}

function reset(): void {
  analyticsConsent.consentGranted = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}
