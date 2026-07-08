import type { AnimationAnchor, AnimationRef } from "@tcg/protocol";

import type { CardOverlayState, Rect } from "./motionTypes";

const DEFAULT_CARD_WIDTH = 118;
const DEFAULT_CARD_HEIGHT = 156;
const STAGE_SELECTOR = ".motion-animation-stage";

export interface RectCache {
  byEntityId: Map<string, Rect>;
  byZoneEntityId: Map<string, Rect>;
  byZoneId: Map<string, Rect>;
  byPlayerId: Map<string, Rect>;
  byAnchorId: Map<string, Rect>;
}

export function readRectCache(): RectCache {
  const cache = emptyRectCache();
  if (!canReadDom()) {
    return cache;
  }
  const root = simulationRoot();
  root.querySelectorAll<HTMLElement>("[data-sim-zone-id]").forEach((zone) => {
    const zoneId = zone.dataset.simZoneId;
    const zoneRect = usableRect(zone);
    if (zoneId && zoneRect) {
      cache.byZoneId.set(zoneId, zoneRect);
      zone.querySelectorAll<HTMLElement>("[data-sim-entity-id]").forEach((entity) => {
        const entityId = entity.dataset.simEntityId;
        const rect = usableRect(entity);
        if (entityId && rect) {
          cache.byZoneEntityId.set(zoneEntityKey(zoneId, entityId), rect);
        }
      });
    }
  });
  root.querySelectorAll<HTMLElement>("[data-sim-entity-id]").forEach((entity) => {
    const entityId = entity.dataset.simEntityId;
    const rect = usableRect(entity);
    if (entityId && rect && !cache.byEntityId.has(entityId)) {
      cache.byEntityId.set(entityId, rect);
    }
  });
  root.querySelectorAll<HTMLElement>("[data-sim-player-id]").forEach((player) => {
    const playerId = player.dataset.simPlayerId;
    const rect = usableRect(player);
    if (playerId && rect) {
      cache.byPlayerId.set(playerId, rect);
    }
  });
  root.querySelectorAll<HTMLElement>("[data-sim-anchor-id]").forEach((anchor) => {
    const anchorId = anchor.dataset.simAnchorId;
    const rect = usableRect(anchor);
    if (anchorId && rect) {
      cache.byAnchorId.set(anchorId, rect);
    }
  });
  return cache;
}

export function emptyRectCache(): RectCache {
  return {
    byEntityId: new Map(),
    byZoneEntityId: new Map(),
    byZoneId: new Map(),
    byPlayerId: new Map(),
    byAnchorId: new Map(),
  };
}

export function resolveEntityRefRect(
  entityId: string,
  ref: AnimationRef | undefined,
  cache: RectCache,
  anchors: readonly AnimationAnchor[],
  preference: "source" | "destination",
): Rect | undefined {
  if (!ref) {
    return cachedEntityRect(cache, entityId) ?? liveEntityRect(entityId);
  }
  if (ref.kind === "zone") {
    return (
      cachedZoneEntityRect(cache, ref.id, entityId) ??
      liveZoneEntityRect(ref.id, entityId) ??
      resolveRefRect(ref, cache, anchors, preference)
    );
  }
  return resolveRefRect(ref, cache, anchors, preference);
}

export function resolveRefRect(
  ref: AnimationRef,
  cache: RectCache,
  anchors: readonly AnimationAnchor[] | undefined,
  preference: "source" | "destination",
): Rect | undefined {
  const safeAnchors = anchors ?? [];
  switch (ref.kind) {
    case "entity":
      return cachedEntityRect(cache, ref.id) ?? liveEntityRect(ref.id);
    case "zone": {
      const zone = cache.byZoneId.get(ref.id) ?? liveDataRect("sim-zone-id", ref.id);
      return zone ? virtualCardRect(zone, preference) : undefined;
    }
    case "player":
      return cache.byPlayerId.get(ref.id) ?? liveDataRect("sim-player-id", ref.id);
    case "anchor": {
      const anchor = safeAnchors.find((candidate) => candidate.id === ref.id);
      if (anchor?.target) {
        return resolveRefRect(anchor.target, cache, anchors, preference);
      }
      return cache.byAnchorId.get(ref.id) ?? liveDataRect("sim-anchor-id", ref.id);
    }
  }
}

export function virtualCardRect(anchor: Rect, preference: "source" | "destination"): Rect {
  const width = Math.min(DEFAULT_CARD_WIDTH, Math.max(82, anchor.width * 0.42));
  const height = Math.min(DEFAULT_CARD_HEIGHT, Math.max(112, width * 1.32));
  const inset = Math.min(18, Math.max(8, anchor.width * 0.08));
  const left =
    preference === "source"
      ? anchor.left + anchor.width - width - inset
      : anchor.left + Math.min(inset, Math.max(0, (anchor.width - width) / 2));
  const top = anchor.top + Math.min(56, Math.max(12, anchor.height * 0.34));
  return {
    left: clamp(left, 8, viewportWidth() - width - 8),
    top: clamp(top, 8, viewportHeight() - height - 8),
    width,
    height,
  };
}

export function buildSuppressionCss(overlays: readonly CardOverlayState[]): string {
  const selectors = overlays.flatMap((overlay) => [
    `${STAGE_SELECTOR} ${dataSelector("sim-entity-id", overlay.entity.id)}`,
    ...[overlay.fromRef, overlay.toRef].flatMap((ref) => {
      if (ref?.kind !== "zone") {
        return [];
      }
      return [
        `${STAGE_SELECTOR} ${dataSelector("sim-zone-id", ref.id)} ${dataSelector(
          "sim-entity-id",
          overlay.entity.id,
        )}`,
      ];
    }),
  ]);
  const unique = Array.from(new Set(selectors));
  return unique.length > 0
    ? `${unique.join(",\n")} { visibility: hidden !important; pointer-events: none !important; }`
    : "";
}

export function buildDestinationZoneSuppressionCss(overlays: readonly CardOverlayState[]): string {
  const selectors = overlays.flatMap((overlay) => {
    if (overlay.toRef?.kind !== "zone") {
      return [];
    }
    return [
      `${STAGE_SELECTOR} ${dataSelector("sim-zone-id", overlay.toRef.id)} ${dataSelector(
        "sim-entity-id",
        overlay.entity.id,
      )}`,
    ];
  });
  const unique = Array.from(new Set(selectors));
  return unique.length > 0
    ? `${unique.join(",\n")} { visibility: hidden !important; pointer-events: none !important; }`
    : "";
}

export function boardRect(): Rect | undefined {
  if (!canReadDom()) {
    return undefined;
  }
  const board = simulationRoot().querySelector<HTMLElement>("[data-sim-board]");
  return board ? usableRect(board) : undefined;
}

export function boardCenter(): { x: number; y: number } {
  const rect = boardRect();
  if (!rect) {
    return { x: viewportWidth() / 2, y: viewportHeight() / 2 };
  }
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

export function rectCenter(rect: Rect): { x: number; y: number } {
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

function liveEntityRect(entityId: string): Rect | undefined {
  if (!canReadDom()) {
    return undefined;
  }
  return liveDataRect("sim-entity-id", entityId);
}

function liveZoneEntityRect(zoneId: string, entityId: string): Rect | undefined {
  if (!canReadDom()) {
    return undefined;
  }
  const zone = simulationRoot().querySelector<HTMLElement>(dataSelector("sim-zone-id", zoneId));
  if (!zone) return undefined;
  const entity = zone.querySelector<HTMLElement>(dataSelector("sim-entity-id", entityId));
  return entity ? usableRect(entity) : undefined;
}

function cachedEntityRect(cache: RectCache, entityId: string): Rect | undefined {
  return cache.byEntityId.get(entityId);
}

function cachedZoneEntityRect(
  cache: RectCache,
  zoneId: string,
  entityId: string,
): Rect | undefined {
  return cache.byZoneEntityId.get(zoneEntityKey(zoneId, entityId));
}

function liveDataRect(name: string, value: string): Rect | undefined {
  if (!canReadDom()) {
    return undefined;
  }
  const element = simulationRoot().querySelector<HTMLElement>(dataSelector(name, value));
  return element ? usableRect(element) : undefined;
}

function simulationRoot(): ParentNode {
  return document.querySelector(STAGE_SELECTOR) ?? document;
}

function usableRect(element: HTMLElement): Rect | undefined {
  if (!canReadDom()) {
    return undefined;
  }
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  if (rect.width <= 0 || rect.height <= 0 || style.display === "none") {
    return undefined;
  }
  return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
}

function dataSelector(name: string, value: string): string {
  return `[data-${name}="${cssAttributeValue(value)}"]`;
}

function zoneEntityKey(zoneId: string, entityId: string): string {
  return `${zoneId}::${entityId}`;
}

function cssAttributeValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\A ");
}

function canReadDom(): boolean {
  return typeof document !== "undefined" && typeof window !== "undefined";
}

function viewportWidth(): number {
  return typeof window === "undefined" ? 1024 : window.innerWidth;
}

function viewportHeight(): number {
  return typeof window === "undefined" ? 768 : window.innerHeight;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
