import {
  rectIntersection,
  type Collision,
  type CollisionDetection,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  PointerDragDropSurface,
  ViewerSafeCardImage,
  type DropDisposition,
} from "@tcg/simulator-ui";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CARD_BACK } from "./CardImage";
import { getGearAttachTargets, getProgramSpatialTargets, useEngineOptional } from "../../engine";
import type { CardDragSource, CardDropEvent, DropTarget } from "../../engine";
import { useCardPreview } from "../CardPreview/CardPreviewContext";
import classes from "./DragDrop.module.css";

export type { CardDragSource, CardDropEvent, DropTarget };

interface DragDropContextValue {
  /** Replace the per-page drop handler. Called once on mount. */
  registerCardDropHandler: (handler: ((event: CardDropEvent) => DropDisposition) | null) => void;
  /** Source card currently being dragged, if any. Used for target affordances. */
  activeSource: CardDragSource | null;
  programTargets: ReadonlySet<string>;
  gearTargets: ReadonlySet<string>;
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

const DIRECT_ATTACK_DROP_ZONES = ["opp-gigArea", "opp-pinfo"] as const;

/**
 * A direct attack is aimed at a thin scoring lane next to other large drop
 * surfaces. `rectIntersection` ranks the dragged card's rectangle, so an
 * adjacent field can win when the pointer itself is visibly inside Rival
 * Gigs. Prefer the direct-attack surface under the pointer so the released
 * location, not the card's grab offset, determines the player's intent.
 */
export function prioritizeDirectAttackCollisions<T extends CollisionLike>(
  source: CardDragSource | null,
  collisions: T[],
  options: {
    pointerCoordinates?: PointLike | null;
    droppableRects?: RectLookupLike | null;
  } = {},
): T[] {
  if (source?.zone !== "p-field") {
    return collisions;
  }

  const directAttackTarget = DIRECT_ATTACK_DROP_ZONES.map((zone) =>
    findZoneAtPoint(zone, options.pointerCoordinates, options.droppableRects),
  ).find((collision) => collision !== null);
  if (!directAttackTarget) {
    return collisions;
  }

  const targetIndex = collisions.findIndex(
    (collision) => String(collision.id) === String(directAttackTarget.id),
  );
  if (targetIndex >= 0) {
    const targetCollision = collisions[targetIndex];
    return [targetCollision, ...collisions.filter((_, index) => index !== targetIndex)];
  }
  return [directAttackTarget as T, ...collisions];
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
  const options = {
    pointerCoordinates: args.pointerCoordinates,
    droppableRects: args.droppableRects,
  };
  const collisions = prioritizeHandReturnCollisions(source, rectIntersection(args), options);
  return prioritizeDirectAttackCollisions(source, collisions, options);
};

export function DragDropProvider({ children }: { children: ReactNode }) {
  const handler = useRef<((event: CardDropEvent) => DropDisposition) | null>(null);
  const [activeSource, setActiveSource] = useState<CardDragSource | null>(null);
  const { hide: hideCardPreview } = useCardPreview();
  const engine = useEngineOptional();
  const matchState = engine?.matchState;
  const side = engine?.humanSide;
  const interactionView = side ? engine?.interactionViews[side] : undefined;
  const pending = engine?.hasPendingRemoteMove;
  // One derivation per source/state revision, never one rules walk per visible card.
  const targets = useMemo(() => {
    if (
      !matchState ||
      !side ||
      !interactionView ||
      pending ||
      activeSource?.zone !== "p-hand" ||
      !activeSource.cardId
    ) {
      return { programTargets: new Set<string>(), gearTargets: new Set<string>() };
    }
    return {
      programTargets: new Set(
        getProgramSpatialTargets({ matchState, side, interactionView }, activeSource.cardId),
      ),
      gearTargets: new Set(
        getGearAttachTargets({ interactionView }, activeSource.cardId, activeSource.cardType),
      ),
    };
  }, [matchState, side, interactionView, pending, activeSource]);

  const registerCardDropHandler = useCallback(
    (next: ((event: CardDropEvent) => DropDisposition) | null) => {
      handler.current = next;
    },
    [],
  );

  const value = useMemo<DragDropContextValue>(
    () => ({ registerCardDropHandler, activeSource, ...targets }),
    [registerCardDropHandler, activeSource, targets],
  );

  const onDragStart = (source: CardDragSource | null) => {
    hideCardPreview();
    setActiveSource(source);
  };

  const onDragCancel = () => {
    setActiveSource(null);
  };

  const onDragEnd = (source: CardDragSource | null, overId: string | null): DropDisposition => {
    setActiveSource(null);
    if (!overId) {
      return { kind: "rejected" };
    }
    const target = decodeTarget(overId);
    if (!source || !target || !handler.current) {
      return { kind: "rejected" };
    }
    if (target.type === "zone" && target.zone === source.zone) {
      return { kind: "rejected" };
    }
    // Ignore drops onto the source's own slot.
    if (target.type === "card" && target.zone === source.zone && target.index === source.index) {
      return { kind: "rejected" };
    }
    return handler.current({ source, target });
  };

  return (
    <Ctx.Provider value={value}>
      <PointerDragDropSurface
        id="cyberpunk-board-dnd"
        decodeSource={decodeSource}
        renderOverlay={(source) => (
          <ViewerSafeCardImage
            entity={{
              id: source.cardId ?? "drag-card",
              title: source.name ?? "Card",
              subtitle: "",
              kind: "card",
              ownerId: "viewer",
              face: "public",
              states: [],
              stats: [],
              traits: [],
              imageUrl: source.imageUrl ?? CARD_BACK,
            }}
            className={classes.image}
          />
        )}
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
    return {
      registerCardDropHandler: () => {},
      activeSource: null,
      programTargets: EMPTY_TARGETS,
      gearTargets: EMPTY_TARGETS,
    };
  }
  return ctx;
}

const EMPTY_TARGETS: ReadonlySet<string> = new Set();
