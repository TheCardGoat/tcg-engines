/**
 * Type declaration shim for node:module to make it compatible with browser builds.
 *
 * The lorcana-engine is built for SSR (via core-simulator), the node:module
 * can be aliased to a browser-compatible shim in core-simulator.
 * In an environment where createRequire isn't available, the translation
 * function will throw a clear error instead of crashing at module load time.
 */

declare module "node:module" {
  type NodeRequire = (id: string) => unknown;

  function createRequire(id: string): NodeRequire;
}
