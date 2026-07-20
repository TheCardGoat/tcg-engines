import {
  rectIntersection,
  type Collision,
  type CollisionDetection,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { PointerDragDropSurface } from "@tcg/simulator-ui";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { Card } from "./Card";
import type { CardDragSource, CardDropEvent, DropTarget } from "../../engine";
import { useCardPreview } from "../CardPreview/CardPreviewContext";
import classes from "./DragDrop.module.css";

export type { CardDragSource, CardDropEvent, DropTarget };

interface DragDropContextValue {
  /** Replace the per-page drop handler. Called once on mount. */
  registerCardDropHandler: (handler: ((event: CardDropEvent) => void) | null) => void;
  /** Source card currently being dragged, if any. Used for target affordances. */
  activeSource: CardDragSource | null;
}

const Ctx = createContext<DragDropContextValue | null>(null);

const SOURCE_PREFIX = "src:";
const TARGET_PREFIX = "tgt:";

export function encodeCardSourceId(source: CardDragSource): string {
  return SOURCE_PREFIX + JSON.stringify(source);
}

export function encodeTargetId(target: DropTarget): string {
  return TARGET_PREFIX + JSON.stringify(target);
}

function decodeSource(id: string): CardDragSource | null {
  if (!id.startsWith(SOURCE_PREFIX)) {
    return null;
  }
  try {
    return JSON.parse(id.slice(SOURCE_PREFIX.length));
  } catch {
    return null;
  }
}

function decodeTarget(id: string): DropTarget | null {
  if (!id.startsWith(TARGET_PREFIX)) {
    return null;
  }
  try {
    return JSON.parse(id.slice(TARGET_PREFIX.length));
  } catch {
    return null;
  }
}

interface CollisionLike {
  id: string | number;
}

interface PointLike {
  x: number;
  y: number;
}

interface RectLike {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface RectLookupLike {
  entries: () => IterableIterator<[UniqueIdentifier, RectLike]>;
}

function targetZone(collision: CollisionLike): string | null {
  const target = decodeTarget(String(collision.id));
  return target?.type === "zone" ? target.zone : null;
}

function isPointInsideRect(point: PointLike, rect: RectLike): boolean {
  return (
    point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom
  );
}

function findZoneAtPoint(
  zone: string,
  point: PointLike | null | undefined,
  droppableRects: RectLookupLike | null | undefined,
): Collision | null {
  if (!point || !droppableRects) {
    return null;
  }
  for (const [id, rect] of droppableRects.entries()) {
    const target = decodeTarget(String(id));
    if (target?.type === "zone" && target.zone === zone && isPointInsideRect(point, rect)) {
      return { id };
    }
  }
  return null;
}

export function prioritizeHandReturnCollisions<T extends CollisionLike>(
  source: CardDragSource | null,
  collisions: T[],
  options: {
    pointerCoordinates?: PointLike | null;
    droppableRects?: RectLookupLike | null;
  } = {},
): T[] {
  if (source?.zone !== "p-hand") {
    return collisions;
  }
  const hasPointerRectContext = Boolean(options.pointerCoordinates && options.droppableRects);
  const handAtPointer = findZoneAtPoint(
    "p-hand",
    options.pointerCoordinates,
    options.droppableRects,
  );
  if (handAtPointer) {
    const handIndex = collisions.findIndex((collision) => targetZone(collision) === "p-hand");
    if (handIndex >= 0) {
      const handCollision = collisions[handIndex];
      return [handCollision, ...collisions.filter((_, index) => index !== handIndex)];
    }
    return [handAtPointer as T, ...collisions];
  }
  if (hasPointerRectContext) {
    return collisions.filter((collision) => targetZone(collision) !== "p-hand");
  }
  const handIndex = collisions.findIndex((collision) => targetZone(collision) === "p-hand");
  const eddiesIndex = collisions.findIndex((collision) => targetZone(collision) === "p-eddies");
  if (handIndex < 0 || eddiesIndex < 0 || handIndex < eddiesIndex) {
    return collisions;
  }
  const handCollision = collisions[handIndex];
  return [handCollision, ...collisions.filter((_, index) => index !== handIndex)];
}

const collisionDetection: CollisionDetection = (args) => {
  const source = decodeSource(String(args.active.id));
  return prioritizeHandReturnCollisions(source, rectIntersection(args), {
    pointerCoordinates: args.pointerCoordinates,
    droppableRects: args.droppableRects,
  });
};

export function DragDropProvider({ children }: { children: ReactNode }) {
  const [handler, setHandler] = useState<((event: CardDropEvent) => void) | null>(null);
  const [activeSource, setActiveSource] = useState<CardDragSource | null>(null);
  const { hide: hideCardPreview } = useCardPreview();

  const registerCardDropHandler = useCallback((next: ((event: CardDropEvent) => void) | null) => {
    setHandler(() => next);
  }, []);

  const value = useMemo<DragDropContextValue>(
    () => ({ registerCardDropHandler, activeSource }),
    [registerCardDropHandler, activeSource],
  );

  const onDragStart = (source: CardDragSource | null) => {
    hideCardPreview();
    setActiveSource(source);
  };

  const onDragCancel = () => {
    setActiveSource(null);
  };

  const onDragEnd = (source: CardDragSource | null, overId: string | null) => {
    setActiveSource(null);
    if (!overId) {
      return;
    }
    const target = decodeTarget(overId);
    if (!source || !target || !handler) {
      return;
    }
    if (target.type === "zone" && target.zone === source.zone) {
      return;
    }
    // Ignore drops onto the source's own slot.
    if (target.type === "card" && target.zone === source.zone && target.index === source.index) {
      return;
    }
    handler({ source, target });
  };

  return (
    <Ctx.Provider value={value}>
      <PointerDragDropSurface
        id="cyberpunk-board-dnd"
        decodeSource={decodeSource}
        renderOverlay={(source) => <Card imageUrl={source.imageUrl} name={source.name} />}
        overlayClassName={classes.overlay}
        collisionDetection={collisionDetection}
        onDragStart={onDragStart}
        onDragCancel={onDragCancel}
        onDragEnd={onDragEnd}
      >
        {children}
      </PointerDragDropSurface>
    </Ctx.Provider>
  );
}

export function useDragDrop(): DragDropContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) {
    return { registerCardDropHandler: () => {}, activeSource: null };
  }
  return ctx;
}
