import { createPortal } from "react-dom";
import { usePaymentSelectionOptional } from "../PaymentSelection/PaymentSelectionContext";
import {
  rectIntersection,
  pointerWithin,
  type Collision,
  type CollisionDetection,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  PointerDragDropSurface,
  createDragMotion,
  useOptionalAnimationRuntime,
  type DragMotion,
  ViewerSafeCardImage,
  type DropDisposition,
} from "@tcg/simulator-ui";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CARD_BACK } from "./CardImage";
import {
  dropShapeAcceptsCardTarget,
  getGearAttachTargets,
  interactionViewActionHasCandidate,
  useEngineOptional,
} from "../../engine";
import type { CardDragSource, CardDropEvent, DropTarget } from "../../engine";
import { EngineContext } from "../../engine/engineContext";
import { useCardPreview } from "../CardPreview/CardPreviewContext";
import { useMediaQuery } from "../../../../lib/media-query";
import classes from "./DragDrop.module.css";

export type { CardDragSource, CardDropEvent, DropTarget };

interface DragDropContextValue {
  /** Replace the per-page drop handler. Called once on mount. */
  registerCardDropHandler: (handler: ((event: CardDropEvent) => DropDisposition) | null) => void;
  /** Source card currently being dragged, if any. Used for target affordances. */
  activeSource: CardDragSource | null;
  /** Released hand card awaiting payment; shown beside the payment controls. */
  pendingPaymentCard: CardDragSource | null;
  gearTargets: ReadonlySet<string>;
  motion: DragMotion<CardDragSource> | null;
  /**
   * Card whose released drop is parked until a transient gate or combat window
   * reopens. While set, the drag session is held in its pending phase instead
   * of returning the card to its source zone.
   */
  parkedDropCardId: string | null;
  setParkedDropCardId: (cardId: string | null) => void;
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

/** The lower-left sell surface can overlap the broad field on small screens. */
export function prioritizeSellCollisions<T extends CollisionLike>(
  source: CardDragSource | null,
  collisions: T[],
  options: {
    pointerCoordinates?: PointLike | null;
    droppableRects?: RectLookupLike | null;
    gearTargets?: ReadonlySet<string>;
  },
): T[] {
  if (source?.zone !== "p-hand") return collisions;
  const sell = findZoneAtPoint("p-eddies", options.pointerCoordinates, options.droppableRects);
  if (!sell) return collisions;
  // A card under the pointer is an explicit attachment or Program target.
  // Sell only wins over the broad field zone, not over that specific card.
  if (source.cardType === "gear" || source.cardType === "program") {
    const card = collisions.find((collision) => {
      const target = decodeTarget(String(collision.id));
      return (
        target?.type === "card" &&
        (source.cardType === "program" ||
          (Boolean(target.cardId) && options.gearTargets?.has(target.cardId ?? "")))
      );
    });
    if (card) return [card, ...collisions.filter((collision) => collision !== card)];
  }
  const index = collisions.findIndex((collision) => String(collision.id) === String(sell.id));
  if (index >= 0) return [collisions[index], ...collisions.filter((_, i) => i !== index)];
  return [sell as T, ...collisions];
}

/**
 * Remove card targets that cannot resolve against the dragged card so the
 * pointer falls through to the enclosing zone. Without this, releasing on a
 * crowded board silently rejected (a Gear over a non-host, a hand Unit over a
 * rival Unit) while the field kept advertising its drop cue.
 *
 * Zone targets always survive; only hand-source card targets are judged.
 */
export function filterAcceptableCardTargets<T extends CollisionLike>(
  source: CardDragSource | null,
  collisions: T[],
  options: {
    gearTargets?: ReadonlySet<string>;
    /** Whether the interaction view currently offers playCard for the source. */
    handPlaysLegal?: boolean;
  },
): T[] {
  if (source?.zone !== "p-hand") {
    return collisions;
  }
  return collisions.filter((collision) => {
    const target = decodeTarget(String(collision.id));
    if (target?.type !== "card") {
      return true;
    }
    if (!target.cardId) {
      return false;
    }
    if (source.cardType === "gear") {
      return Boolean(options.gearTargets?.has(target.cardId));
    }
    if (!dropShapeAcceptsCardTarget(source, target.zone)) {
      return false;
    }
    return options.handPlaysLegal ?? true;
  });
}

const rankCollisions = (
  args: Parameters<CollisionDetection>[0],
  gearTargets: ReadonlySet<string>,
  handPlaysLegal: boolean,
): Collision[] => {
  const source = decodeSource(String(args.active.id));
  const options = {
    pointerCoordinates: args.pointerCoordinates,
    droppableRects: args.droppableRects,
    gearTargets,
  };
  // Pointer intent wins over the dragged rectangle, which may cover several targets.
  // A Unit target is more specific than its containing field; the adapter still
  // validates legality after collision detection.
  const pointed = args.pointerCoordinates ? pointerWithin(args) : rectIntersection(args);
  const ranked = filterAcceptableCardTargets(source, [...pointed], {
    gearTargets,
    handPlaysLegal,
  }).sort((a, b) => {
    const ta = decodeTarget(String(a.id)),
      tb = decodeTarget(String(b.id));
    return Number(tb?.type === "card") - Number(ta?.type === "card");
  });
  const collisions = prioritizeHandReturnCollisions(source, ranked, options);
  const withSell = prioritizeSellCollisions(source, collisions, options);
  return prioritizeDirectAttackCollisions(source, withSell, options);
};

export function DragDropProvider({
  children,
  presentation = "dom",
}: {
  children: ReactNode;
  presentation?: "dom" | "scene";
}) {
  const [motion] = useState(() => createDragMotion<CardDragSource>());
  const session = useSyncExternalStore(motion.subscribe, motion.getSnapshot, motion.getSnapshot);
  const animation = useOptionalAnimationRuntime();
  const payment = usePaymentSelectionOptional();
  const handler = useRef<((event: CardDropEvent) => DropDisposition) | null>(null);
  const [activeSource, setActiveSource] = useState<CardDragSource | null>(null);
  const [parkedDropCardId, setParkedDropCardId] = useState<string | null>(null);
  const { hide: hideCardPreview } = useCardPreview();
  const isMobileBoard = useMediaQuery("(max-width: 767px)", false);
  const engine = useEngineOptional();
  const authoritativeState = useContext(EngineContext)?.matchState;
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
      return { gearTargets: new Set<string>(), handPlaysLegal: false };
    }
    return {
      gearTargets: new Set(
        getGearAttachTargets({ interactionView }, activeSource.cardId, activeSource.cardType),
      ),
      handPlaysLegal: interactionViewActionHasCandidate(
        interactionView,
        "playCard",
        "cardId",
        activeSource.cardId,
      ),
    };
  }, [matchState, side, interactionView, pending, activeSource]);
  const collisionDetection = useCallback<CollisionDetection>(
    (args) => rankCollisions(args, targets.gearTargets, targets.handPlaysLegal),
    [targets.gearTargets, targets.handPlaysLegal],
  );

  const registerCardDropHandler = useCallback(
    (next: ((event: CardDropEvent) => DropDisposition) | null) => {
      handler.current = next;
    },
    [],
  );

  const value = useMemo<DragDropContextValue>(
    () => ({
      registerCardDropHandler,
      activeSource,
      pendingPaymentCard:
        payment?.paymentSelectionActive && session?.phase === "pending" ? session.source : null,
      motion,
      parkedDropCardId,
      setParkedDropCardId,
      ...targets,
    }),
    [
      registerCardDropHandler,
      activeSource,
      payment?.paymentSelectionActive,
      session,
      motion,
      parkedDropCardId,
      setParkedDropCardId,
      targets,
    ],
  );

  useEffect(() => () => motion.finish(), [motion]);
  useEffect(() => {
    if (session?.phase !== "pending") return;
    const entityId = session.source.cardId;
    const transfer = animation?.compiledPlan?.steps.some(
      ({ step }) =>
        (step.type === "entityTransfer" && step.entity.id === entityId) ||
        (step.type === "effect" &&
          step.presentation === "source-card" &&
          step.source?.kind === "entity" &&
          step.source.id === entityId),
    );
    if (transfer) {
      motion.finish();
      return;
    }
    // A parked drop is waiting for its gate or combat window; hold the session.
    if (parkedDropCardId || pending || payment?.paymentSelectionActive) return;
    // A choice-only drop or rejected command leaves the card in its source zone.
    // Committed moves are handed to the animation layer above.
    const sourceZone = session.source.zone.replace(/^(p|opp)-/, "");
    const card = entityId ? authoritativeState?.G.cardIndex[entityId] : undefined;
    if (card && card.zone !== sourceZone) {
      // The engine can commit before the animation bridge queues its plan.
      // Keep the released pose for endpoint capture in that next layout pass.
      if (entityId && (animation?.speed === "off" || animation?.spatialMotionSuppressed))
        animation?.registry.setDragOrigin(entityId, null);
      motion.finish();
    } else {
      if (entityId) animation?.registry.setDragOrigin(entityId, null);
      motion.returnToSource();
    }
  }, [
    session,
    pending,
    payment?.paymentSelectionActive,
    parkedDropCardId,
    authoritativeState,
    animation,
    motion,
  ]);

  const onDragStart = (source: CardDragSource | null) => {
    hideCardPreview();
    // A fresh drag supersedes any drop parked from a previous session.
    setParkedDropCardId(null);
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
    const pose = motion.getSnapshot();
    if (source.cardId && pose) {
      animation?.registry.setDragOrigin(
        source.cardId,
        new DOMRect(
          pose.rect.left + pose.offset.x,
          pose.rect.top + pose.offset.y,
          pose.rect.width,
          pose.rect.height,
        ),
      );
    }
    const result = handler.current({ source, target });
    if (result.kind === "rejected" && source.cardId)
      animation?.registry.setDragOrigin(source.cardId, null);
    return result;
  };

  return (
    <Ctx.Provider value={value}>
      <PointerDragDropSurface
        id="cyberpunk-board-dnd"
        motion={motion}
        presentation="external"
        decodeSource={decodeSource}
        renderOverlay={() => null}
        collisionDetection={collisionDetection}
        // The mobile hand scrolls horizontally. Only touch drags need a
        // vertical threshold; mouse drags keep the normal activation distance.
        touchActivationConstraint={isMobileBoard ? { distance: { y: 16 } } : undefined}
        onDragStart={onDragStart}
        onDragCancel={onDragCancel}
        onDragEnd={onDragEnd}
      >
        {children}
        {(presentation === "dom" ||
          session?.source.zone === "p-legendArea" ||
          session?.source.zone === "p-hand") && (
          <CardDragVisual
            motion={motion}
            parked={Boolean(payment?.paymentSelectionActive) || parkedDropCardId !== null}
          />
        )}
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
      pendingPaymentCard: null,
      gearTargets: EMPTY_TARGETS,
      motion: null,
      parkedDropCardId: null,
      setParkedDropCardId: () => {},
    };
  }
  return ctx;
}

const EMPTY_TARGETS: ReadonlySet<string> = new Set();

/** V1 draws the same shared drag session in viewport coordinates. */
export function DragCardImage({ source }: { source: CardDragSource }) {
  return (
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
  );
}

function CardDragVisual({
  motion,
  parked,
}: {
  motion: DragMotion<CardDragSource>;
  parked: boolean;
}) {
  const session = useSyncExternalStore(motion.subscribe, motion.getSnapshot, motion.getSnapshot);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(
    () =>
      motion.subscribe(() => {
        const current = motion.getSnapshot();
        if (ref.current && current)
          ref.current.style.transform = `translate3d(${current.offset.x}px, ${current.offset.y}px, 0)`;
      }),
    [motion],
  );
  if (!session || (parked && session.phase === "pending")) return null;
  return createPortal(
    <div
      ref={ref}
      data-card-drag-visual={session.source.cardId}
      style={{
        position: "fixed",
        pointerEvents: "none",
        zIndex: 1000,
        left: session.rect.left,
        top: session.rect.top,
        width: session.rect.width,
        height: session.rect.height,
        transform: `translate3d(${session.offset.x}px, ${session.offset.y}px, 0)`,
      }}
    >
      <DragCardImage source={session.source} />
    </div>,
    document.body,
  );
}
