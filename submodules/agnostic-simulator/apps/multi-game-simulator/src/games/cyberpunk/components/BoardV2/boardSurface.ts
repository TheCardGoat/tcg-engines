import { useSyncExternalStore } from "react";
import defaultSurfaceUrl from "./assets/surface-weathered-v2.webp";

/**
 * Player-selectable V2 board surfaces. `default` keeps the bundled weathered
 * steel; other presets load from the published board-v2 CDN revision (see
 * assets/control-assets.md). The selection is a local presentation preference
 * and never enters match state.
 */
const SURFACE_CDN_BASE = "https://cdn.tcg.online/public/cyberpunk/simulator/ui/board-v2/v1";

export const BOARD_SURFACE_STORAGE_KEY = "tcg:cyberpunk:board-surface:v1";

export interface BoardSurface {
  id: string;
  label: string;
  /** CDN URL, or null to use the bundled default texture. */
  src: string | null;
}

export const CYBERPUNK_BOARD_SURFACES = {
  default: { id: "default", label: "Factory steel", src: null },
  plates: {
    id: "plates",
    label: "Gunmetal plates",
    src: `${SURFACE_CDN_BASE}/surface-plates.webp`,
  },
  "tech-mat": {
    id: "tech-mat",
    label: "Hex tech mat",
    src: `${SURFACE_CDN_BASE}/surface-techmat.webp`,
  },
  street: { id: "street", label: "Night street", src: `${SURFACE_CDN_BASE}/surface-street.webp` },
} as const satisfies Record<string, BoardSurface>;

export type BoardSurfaceId = keyof typeof CYBERPUNK_BOARD_SURFACES;
/** A preset straight from the published table; its id stays a literal. */
export type BoardSurfacePreset = (typeof CYBERPUNK_BOARD_SURFACES)[BoardSurfaceId];
const DEFAULT_SURFACE = CYBERPUNK_BOARD_SURFACES.default;

/** Missing or retired ids fall back to the default so removed presets degrade safely. */
export function resolveBoardSurface(selection: string | null | undefined): BoardSurface {
  if (selection && Object.hasOwn(CYBERPUNK_BOARD_SURFACES, selection)) {
    return CYBERPUNK_BOARD_SURFACES[selection as BoardSurfaceId];
  }
  return DEFAULT_SURFACE;
}

/** The texture the scene renders: the chosen CDN surface, or the bundled default. */
export function boardSurfaceTextureUrl(surface: BoardSurface): string {
  return surface.src ?? defaultSurfaceUrl;
}

let storedId = readStoredSurfaceId();
const listeners = new Set<() => void>();

function readStoredSurfaceId(): BoardSurfaceId {
  try {
    const stored = localStorage.getItem(BOARD_SURFACE_STORAGE_KEY);
    const match = Object.values(CYBERPUNK_BOARD_SURFACES).find((surface) => surface.id === stored);
    return match ? match.id : DEFAULT_SURFACE.id;
  } catch {
    return DEFAULT_SURFACE.id;
  }
}

function subscribeToBoardSurface(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setBoardSurface(id: BoardSurfaceId): void {
  if (storedId === id) return;
  storedId = id;
  try {
    localStorage.setItem(BOARD_SURFACE_STORAGE_KEY, id);
  } catch {
    // Blocked storage must not prevent switching surfaces for this session.
  }
  for (const listener of listeners) listener();
}

export function useBoardSurfaceId(): BoardSurfaceId {
  return useSyncExternalStore(
    subscribeToBoardSurface,
    () => storedId,
    () => DEFAULT_SURFACE.id,
  );
}

/**
 * Warm the browser cache before the picker commits a selection so a failed CDN
 * load cannot blank the 3D surface. The request must be anonymous CORS to match
 * the WebGL texture fetch — a non-CORS cache entry is exactly what
 * BoardTextureLoader has to recover from.
 */
export function preloadBoardSurface(surface: BoardSurface): Promise<void> {
  const src = surface.src;
  if (!src) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve();
    image.onerror = () => reject(new Error(`Board surface failed to load: ${src}`));
    image.src = src;
  });
}
