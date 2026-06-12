import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { EngineCardType, MoveId, Side } from "../../engine";

export type DirectCardMoveId = Extract<
  MoveId,
  | "sellCard"
  | "playCard"
  | "callLegend"
  | "goSolo"
  | "attackUnit"
  | "attackRival"
  | "useBlocker"
  | "activateAbility"
>;

interface MoveSelection {
  side: Side;
  moveId: DirectCardMoveId;
  /** Source card already chosen for a two-step direct move, such as Gear attach. */
  sourceCardId?: string;
  /** Public type of the source card, used to keep play-card target prompts type-specific. */
  sourceCardType?: EngineCardType;
}

interface MoveSelectionContextValue {
  selection: MoveSelection | null;
  setSelection: (selection: MoveSelection | null) => void;
  clearSelection: () => void;
}

const MoveSelectionContext = createContext<MoveSelectionContextValue | null>(null);

export function MoveSelectionProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<MoveSelection | null>(null);
  const value = useMemo<MoveSelectionContextValue>(
    () => ({
      selection,
      setSelection,
      clearSelection: () => setSelection(null),
    }),
    [selection],
  );

  return <MoveSelectionContext.Provider value={value}>{children}</MoveSelectionContext.Provider>;
}

export function useMoveSelection(): MoveSelectionContextValue {
  const ctx = useContext(MoveSelectionContext);
  if (!ctx) {
    return {
      selection: null,
      setSelection: () => undefined,
      clearSelection: () => undefined,
    };
  }
  return ctx;
}

export function useMoveSelectionForSide(side: Side): DirectCardMoveId | null {
  const { selection } = useMoveSelection();
  return selection?.side === side ? selection.moveId : null;
}

export function useMoveSelectionStateForSide(side: Side): MoveSelection | null {
  const { selection } = useMoveSelection();
  return selection?.side === side ? selection : null;
}
