import { PointerDragDropSurface } from "@tcg/simulator-ui";
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { useLayoutMode, type LayoutMode } from "../../../lib/use-layout-mode.ts";
import { GameCardVisual } from "../GameCard.tsx";
import type { CardSize } from "../card/card-image-format.ts";
import type { GameCardData } from "../types.ts";

const SOURCE_PREFIX = "gundam-source:";
const TARGET_PREFIX = "gundam-target:";

export interface GundamHandCardDragSource {
  readonly type: "hand-card";
  readonly cardId: string;
  readonly card: Pick<GameCardData, "name" | "img" | "cardType" | "cost">;
}

export interface GundamAttackUnitDragSource {
  readonly type: "attack-unit";
  readonly cardId: string;
  readonly card: Pick<GameCardData, "name" | "img" | "cardType" | "cost">;
  readonly legalTargetIds: readonly string[];
  readonly directTargetLabel: string;
}

export type GundamDragSource = GundamHandCardDragSource | GundamAttackUnitDragSource;

export function gundamDragOverlaySize(source: GundamDragSource, layout: LayoutMode): CardSize {
  if (source.type === "hand-card") return "tiny";
  return layout === "mobile" ? "micro" : "small";
}

export interface GundamBattleAreaDropTarget {
  readonly type: "battle-area";
  readonly playerId: string;
}

export interface GundamAttackDropTarget {
  readonly type: "attack-target";
  readonly targetId: string;
}

export interface GundamPilotDropTarget {
  readonly type: "pilot-target";
  readonly unitId: string;
}

export type GundamDropTarget =
  | GundamBattleAreaDropTarget
  | GundamAttackDropTarget
  | GundamPilotDropTarget;

interface GundamDragCommandsContextValue {
  readonly registerCardDropHandler: (handler: (cardId: string) => void) => () => void;
  readonly registerAttackDropHandler: (
    handler: (attackerId: string, targetId: string) => void,
  ) => () => void;
  /**
   * The handler verifies the current interaction-derived Pilot/Unit pair
   * before starting the move.  The drop surface deliberately has no rules
   * knowledge of its own.
   */
  readonly registerPilotDropHandler: (
    handler: (pilotId: string, unitId: string) => boolean,
  ) => () => void;
  readonly consumeDragHandledTransfer: (cardId: string) => boolean;
}

const GundamDragStateContext = createContext<GundamDragSource | null>(null);
const GundamDragCommandsContext = createContext<GundamDragCommandsContextValue | null>(null);
const DRAG_HANDOFF_TTL_MS = 1_000;

export interface GundamDragAnimationHandoff {
  readonly arm: (cardId: string) => void;
  readonly consume: (cardId: string) => boolean;
}

export function createGundamDragAnimationHandoff(
  now: () => number = () => performance.now(),
): GundamDragAnimationHandoff {
  const pending = new Map<string, number>();

  return {
    arm: (cardId) => {
      pending.set(cardId, now() + DRAG_HANDOFF_TTL_MS);
    },
    consume: (cardId) => {
      const expiresAt = pending.get(cardId);
      pending.delete(cardId);
      return expiresAt !== undefined && expiresAt >= now();
    },
  };
}

export function encodeGundamHandCardSource(source: GundamHandCardDragSource): string {
  return `${SOURCE_PREFIX}${JSON.stringify(source)}`;
}

export function encodeGundamAttackUnitSource(source: GundamAttackUnitDragSource): string {
  return `${SOURCE_PREFIX}${JSON.stringify(source)}`;
}

export function decodeGundamDragSource(id: string): GundamDragSource | null {
  if (!id.startsWith(SOURCE_PREFIX)) return null;
  try {
    const source = JSON.parse(id.slice(SOURCE_PREFIX.length)) as GundamDragSource;
    if (source.type === "hand-card" && Boolean(source.cardId)) return source;
    if (
      source.type === "attack-unit" &&
      Boolean(source.cardId) &&
      Array.isArray(source.legalTargetIds)
    ) {
      return source;
    }
    return null;
  } catch {
    return null;
  }
}

export function decodeGundamHandCardSource(id: string): GundamHandCardDragSource | null {
  const source = decodeGundamDragSource(id);
  return source?.type === "hand-card" ? source : null;
}

export function encodeGundamBattleAreaTarget(target: GundamBattleAreaDropTarget): string {
  return `${TARGET_PREFIX}${JSON.stringify(target)}`;
}

export function encodeGundamAttackTarget(target: GundamAttackDropTarget): string {
  return `${TARGET_PREFIX}${JSON.stringify(target)}`;
}

export function encodeGundamPilotTarget(target: GundamPilotDropTarget): string {
  return `${TARGET_PREFIX}${JSON.stringify(target)}`;
}

export function decodeGundamDropTarget(id: string): GundamDropTarget | null {
  if (!id.startsWith(TARGET_PREFIX)) return null;
  try {
    const target = JSON.parse(id.slice(TARGET_PREFIX.length)) as GundamDropTarget;
    if (target.type === "battle-area" && Boolean(target.playerId)) return target;
    if (target.type === "attack-target" && Boolean(target.targetId)) return target;
    if (target.type === "pilot-target" && Boolean(target.unitId)) return target;
    return null;
  } catch {
    return null;
  }
}

export function decodeGundamBattleAreaTarget(id: string): GundamBattleAreaDropTarget | null {
  const target = decodeGundamDropTarget(id);
  return target?.type === "battle-area" ? target : null;
}

export function dispatchGundamCardDrop(
  source: GundamHandCardDragSource | null,
  overId: string | null,
  handler: ((cardId: string) => void) | null,
  onAccepted?: (cardId: string) => void,
): boolean {
  if (!source || !overId || !handler || !decodeGundamBattleAreaTarget(overId)) return false;
  onAccepted?.(source.cardId);
  handler(source.cardId);
  return true;
}

export function dispatchGundamAttackDrop(
  source: GundamAttackUnitDragSource | null,
  overId: string | null,
  handler: ((attackerId: string, targetId: string) => void) | null,
): boolean {
  if (!source || !overId || !handler) return false;
  const target = decodeGundamDropTarget(overId);
  if (target?.type !== "attack-target" || !source.legalTargetIds.includes(target.targetId)) {
    return false;
  }
  handler(source.cardId, target.targetId);
  return true;
}

export function dispatchGundamPilotDrop(
  source: GundamHandCardDragSource | null,
  overId: string | null,
  handler: ((pilotId: string, unitId: string) => boolean) | null,
): boolean {
  // Rule 3-4-6-2 lets a Command with a 【Pilot】 effect pair with a Unit
  // instead of resolving as a Command. The registered handler derives the
  // actual legal source/host pair from the current interaction, so Commands
  // without that alternative still cannot be accepted here.
  if (
    !source ||
    (source.card.cardType !== "pilot" && source.card.cardType !== "command") ||
    !overId ||
    !handler
  ) {
    return false;
  }
  const target = decodeGundamDropTarget(overId);
  if (target?.type !== "pilot-target") return false;
  return handler(source.cardId, target.unitId);
}

export function GundamDragDropProvider({ children }: { readonly children: ReactNode }) {
  const layout = useLayoutMode();
  const [activeSource, setActiveSource] = useState<GundamDragSource | null>(null);
  const cardDropHandlerRef = useRef<((cardId: string) => void) | null>(null);
  const attackDropHandlerRef = useRef<((attackerId: string, targetId: string) => void) | null>(
    null,
  );
  const pilotDropHandlerRef = useRef<((pilotId: string, unitId: string) => boolean) | null>(null);
  const animationHandoffRef = useRef<GundamDragAnimationHandoff | null>(null);
  animationHandoffRef.current ??= createGundamDragAnimationHandoff();

  const registerCardDropHandler = useCallback((next: (cardId: string) => void) => {
    cardDropHandlerRef.current = next;
    return () => {
      if (cardDropHandlerRef.current === next) cardDropHandlerRef.current = null;
    };
  }, []);
  const registerAttackDropHandler = useCallback(
    (next: (attackerId: string, targetId: string) => void) => {
      attackDropHandlerRef.current = next;
      return () => {
        if (attackDropHandlerRef.current === next) attackDropHandlerRef.current = null;
      };
    },
    [],
  );
  const registerPilotDropHandler = useCallback(
    (next: (pilotId: string, unitId: string) => boolean) => {
      pilotDropHandlerRef.current = next;
      return () => {
        if (pilotDropHandlerRef.current === next) pilotDropHandlerRef.current = null;
      };
    },
    [],
  );
  const consumeDragHandledTransfer = useCallback(
    (cardId: string) => animationHandoffRef.current?.consume(cardId) ?? false,
    [],
  );

  const commands = useMemo(
    () => ({
      registerCardDropHandler,
      registerAttackDropHandler,
      registerPilotDropHandler,
      consumeDragHandledTransfer,
    }),
    [
      consumeDragHandledTransfer,
      registerAttackDropHandler,
      registerCardDropHandler,
      registerPilotDropHandler,
    ],
  );
  const renderOverlay = useCallback(
    (source: GundamDragSource) => <GundamDragOverlayVisual source={source} layout={layout} />,
    [layout],
  );

  return (
    <GundamDragCommandsContext.Provider value={commands}>
      <GundamDragStateContext.Provider value={activeSource}>
        <PointerDragDropSurface
          id="gundam-board-dnd"
          decodeSource={decodeGundamDragSource}
          renderOverlay={renderOverlay}
          overlayClassName="will-change-transform [transform:rotate(var(--drag-tilt,0deg))]"
          onDragStart={setActiveSource}
          onDragCancel={() => setActiveSource(null)}
          onDragEnd={(source, overId) => {
            setActiveSource(null);
            if (source?.type === "attack-unit") {
              return dispatchGundamAttackDrop(source, overId, attackDropHandlerRef.current);
            }
            if (
              dispatchGundamPilotDrop(
                source?.type === "hand-card" ? source : null,
                overId,
                pilotDropHandlerRef.current,
              )
            ) {
              return true;
            }
            return dispatchGundamCardDrop(
              source?.type === "hand-card" ? source : null,
              overId,
              cardDropHandlerRef.current,
              (cardId) => animationHandoffRef.current?.arm(cardId),
            );
          }}
        >
          {children}
        </PointerDragDropSurface>
        <span className="sr-only" aria-live="polite">
          {activeSource?.type === "attack-unit"
            ? `Dragging ${activeSource.card.name}. Drop on the opposing player area or a highlighted enemy Unit to attack.`
            : ""}
        </span>
      </GundamDragStateContext.Provider>
    </GundamDragCommandsContext.Provider>
  );
}

const GundamDragOverlayVisual = memo(function GundamDragOverlayVisual({
  source,
  layout,
}: {
  readonly source: GundamDragSource;
  readonly layout: LayoutMode;
}) {
  return (
    <div className="pointer-events-none rotate-2 opacity-95 drop-shadow-2xl">
      <GameCardVisual
        {...source.card}
        id={source.cardId}
        size={gundamDragOverlaySize(source, layout)}
      />
    </div>
  );
});

export function useGundamDragState(): GundamDragSource | null {
  return useContext(GundamDragStateContext);
}

const EMPTY_COMMANDS: GundamDragCommandsContextValue = {
  registerCardDropHandler: () => () => {},
  registerAttackDropHandler: () => () => {},
  registerPilotDropHandler: () => () => {},
  consumeDragHandledTransfer: () => false,
};

export function useGundamDragCommands(): GundamDragCommandsContextValue {
  return useContext(GundamDragCommandsContext) ?? EMPTY_COMMANDS;
}
