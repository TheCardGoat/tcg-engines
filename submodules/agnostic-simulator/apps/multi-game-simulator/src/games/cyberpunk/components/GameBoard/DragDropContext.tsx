import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  defaultDropAnimationSideEffects,
  rectIntersection,
  useDndMonitor,
  useSensor,
  useSensors,
  type Collision,
  type CollisionDetection,
  type DragEndEvent,
  type DragMoveEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Card } from "./Card";
import type { CardDragSource, CardDropEvent, DropTarget } from "../../engine";
import { useCardPreview } from "./CardPreviewContext";
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

/**
 * Drop animation: when the user releases over an invalid spot, the card
 * settles back into the source slot with a snap; over a valid target,
 * the overlay fades out as the underlying state catches up.
 */
const DROP_ANIMATION = {
  duration: 220,
  easing: "cubic-bezier(0.18, 0.67, 0.32, 1.32)",
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: { opacity: "0" },
    },
  }),
};

/**
 * Renders the drag overlay and applies a velocity-based tilt to it so the
 * card "leans" the way it's moving. Lives inside DndContext so it can use
 * useDndMonitor.
 */
function DragOverlayHost({ source }: { source: CardDragSource | null }) {
  // Tilt is held in a ref + applied imperatively to avoid a setState on every
  // mouse-move frame. We update via rAF to keep things smooth.
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const last = useRef({ x: 0, t: 0 });
  const tilt = useRef(0);

  const apply = (deg: number) => {
    if (overlayRef.current) {
      overlayRef.current.style.setProperty("--drag-tilt", `${deg.toFixed(2)}deg`);
    }
  };

  useDndMonitor({
    onDragStart: () => {
      last.current = { x: 0, t: performance.now() };
      tilt.current = 0;
      apply(0);
    },
    onDragMove: (event: DragMoveEvent) => {
      const now = performance.now();
      const dx = event.delta.x - last.current.x;
      const dt = Math.max(1, now - last.current.t);
      // Instantaneous horizontal velocity (px/ms) → tilt degrees.
      const instant = (dx / dt) * 35;
      const next = Math.max(-14, Math.min(14, tilt.current * 0.5 + instant * 0.5));
      tilt.current = next;
      last.current = { x: event.delta.x, t: now };
      apply(next);
    },
    onDragEnd: () => {
      tilt.current = 0;
      apply(0);
    },
  });

  return (
    <DragOverlay dropAnimation={DROP_ANIMATION}>
      {source ? (
        <div ref={overlayRef} className={classes.overlay}>
          <Card imageUrl={source.imageUrl} name={source.name} />
        </div>
      ) : null}
    </DragOverlay>
  );
}

export function DragDropProvider({ children }: { children: ReactNode }) {
  const [handler, setHandler] = useState<((event: CardDropEvent) => void) | null>(null);
  const [activeSource, setActiveSource] = useState<CardDragSource | null>(null);
  const { hide: hideCardPreview } = useCardPreview();

  // PointerSensor with a small distance threshold so plain clicks (e.g. on
  // dice or buttons) aren't interpreted as drags.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor),
  );

  const registerCardDropHandler = useCallback((next: ((event: CardDropEvent) => void) | null) => {
    setHandler(() => next);
  }, []);

  const value = useMemo<DragDropContextValue>(
    () => ({ registerCardDropHandler, activeSource }),
    [registerCardDropHandler, activeSource],
  );

  const onDragStart = (event: DragStartEvent) => {
    const id = String(event.active.id);
    hideCardPreview();
    setActiveSource(decodeSource(id));
  };

  const onDragCancel = () => {
    setActiveSource(null);
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveSource(null);
    const sourceId = String(event.active.id);
    const overId = event.over ? String(event.over.id) : null;
    if (!overId) {
      return;
    }
    const source = decodeSource(sourceId);
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
      <DndContext
        collisionDetection={collisionDetection}
        sensors={sensors}
        onDragStart={onDragStart}
        onDragCancel={onDragCancel}
        onDragEnd={onDragEnd}
      >
        {children}
        <DragOverlayHost source={activeSource} />
      </DndContext>
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
