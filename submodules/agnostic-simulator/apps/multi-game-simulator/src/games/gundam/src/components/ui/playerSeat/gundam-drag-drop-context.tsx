import { PointerDragDropSurface } from "@tcg/simulator-ui";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { GameCard } from "../GameCard.tsx";
import type { GameCardData } from "../types.ts";

const SOURCE_PREFIX = "gundam-source:";
const TARGET_PREFIX = "gundam-target:";

export interface GundamHandCardDragSource {
  readonly type: "hand-card";
  readonly cardId: string;
  readonly card: Pick<GameCardData, "name" | "img" | "cardType" | "cost">;
}

export interface GundamBattleAreaDropTarget {
  readonly type: "battle-area";
  readonly playerId: string;
}

interface GundamDragDropContextValue {
  readonly activeSource: GundamHandCardDragSource | null;
  readonly registerCardDropHandler: (handler: ((cardId: string) => void) | null) => void;
}

const GundamDragDropContext = createContext<GundamDragDropContextValue | null>(null);

export function encodeGundamHandCardSource(source: GundamHandCardDragSource): string {
  return `${SOURCE_PREFIX}${JSON.stringify(source)}`;
}

export function decodeGundamHandCardSource(id: string): GundamHandCardDragSource | null {
  if (!id.startsWith(SOURCE_PREFIX)) return null;
  try {
    const source = JSON.parse(id.slice(SOURCE_PREFIX.length)) as GundamHandCardDragSource;
    return source.type === "hand-card" && Boolean(source.cardId) ? source : null;
  } catch {
    return null;
  }
}

export function encodeGundamBattleAreaTarget(target: GundamBattleAreaDropTarget): string {
  return `${TARGET_PREFIX}${JSON.stringify(target)}`;
}

export function decodeGundamBattleAreaTarget(id: string): GundamBattleAreaDropTarget | null {
  if (!id.startsWith(TARGET_PREFIX)) return null;
  try {
    const target = JSON.parse(id.slice(TARGET_PREFIX.length)) as GundamBattleAreaDropTarget;
    return target.type === "battle-area" && Boolean(target.playerId) ? target : null;
  } catch {
    return null;
  }
}

export function dispatchGundamCardDrop(
  source: GundamHandCardDragSource | null,
  overId: string | null,
  handler: ((cardId: string) => void) | null,
): boolean {
  if (!source || !overId || !handler || !decodeGundamBattleAreaTarget(overId)) return false;
  handler(source.cardId);
  return true;
}

export function GundamDragDropProvider({ children }: { readonly children: ReactNode }) {
  const [activeSource, setActiveSource] = useState<GundamHandCardDragSource | null>(null);
  const [handler, setHandler] = useState<((cardId: string) => void) | null>(null);

  const registerCardDropHandler = useCallback((next: ((cardId: string) => void) | null) => {
    setHandler(() => next);
  }, []);

  const value = useMemo(
    () => ({ activeSource, registerCardDropHandler }),
    [activeSource, registerCardDropHandler],
  );

  return (
    <GundamDragDropContext.Provider value={value}>
      <PointerDragDropSurface
        id="gundam-board-dnd"
        decodeSource={decodeGundamHandCardSource}
        renderOverlay={(source) => (
          <div className="pointer-events-none rotate-2 opacity-95 drop-shadow-2xl">
            <GameCard {...source.card} id={source.cardId} size="tiny" />
          </div>
        )}
        overlayClassName="will-change-transform [transform:rotate(var(--drag-tilt,0deg))]"
        onDragStart={setActiveSource}
        onDragCancel={() => setActiveSource(null)}
        onDragEnd={(source, overId) => {
          setActiveSource(null);
          dispatchGundamCardDrop(source, overId, handler);
        }}
      >
        {children}
      </PointerDragDropSurface>
    </GundamDragDropContext.Provider>
  );
}

export function useGundamDragDrop(): GundamDragDropContextValue {
  return (
    useContext(GundamDragDropContext) ?? {
      activeSource: null,
      registerCardDropHandler: () => {},
    }
  );
}
