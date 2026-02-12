// See https://svelte.dev/docs/kit/types#app.d.ts
// For information about these interfaces
declare global {
  namespace App {
    // Interface Error {}
    // Interface Locals {}
    // Interface PageData {}
    // Interface PageState {}
    interface Platform {
      env?: {
        // Add your Cloudflare bindings here (KV, D1, R2, etc.)
        // Example:
        // MY_KV: KVNamespace;
        // MY_DB: D1Database;
      };
      context?: {
        waitUntil(promise: Promise<unknown>): void;
      };
      caches?: CacheStorage & { default: Cache };
    }
  }
}
