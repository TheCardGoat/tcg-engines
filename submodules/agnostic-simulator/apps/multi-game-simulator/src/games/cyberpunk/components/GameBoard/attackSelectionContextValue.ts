import { createContext } from "react";
import type { Side } from "../../engine";

export interface AttackSelectionState {
  side: Side;
  attackerId: string;
  intent: "any" | "fight" | "steal";
}

export interface AttackSelectionContextValue {
  selection: AttackSelectionState | null;
  setAttacker: (side: Side, attackerId: string, intent?: AttackSelectionState["intent"]) => void;
  clearSelection: () => void;
}

export const AttackSelectionContext = createContext<AttackSelectionContextValue | null>(null);
