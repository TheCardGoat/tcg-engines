// Shim for node:module to make lorcana-engine compatible with browser builds
// This file provides a minimal interface that matches what translate-log-message.ts needs

export interface NodeModule {
  createRequire(id: string): NodeRequire;
}

type NodeRequire = (id: string) => unknown;

export function createRequire(id: string): NodeRequire {
  // In Node.js environment, use the real createRequire
  const createRequireFn = (globalThis as { createRequire?: NodeRequire }).createRequire;
  if (typeof createRequireFn === "function") {
    return createRequireFn;
  }
  // In browser environments without createRequire, return a stub
  // that throws when actually used
  return () => {
    throw new Error(
      `Cannot require '${id}'. Paraglide messages not compiled. Run i18n:compile before using Lorcana log translation.`,
    );
  };
}
