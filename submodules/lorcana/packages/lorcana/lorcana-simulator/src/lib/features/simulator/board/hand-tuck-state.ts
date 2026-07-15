import type { LorcanaPlayerSide } from "@/features/simulator/model/contracts.js";

export type HandTuckState = Record<LorcanaPlayerSide, boolean>;

export function toggleHandTuckState(
  state: HandTuckState,
  playerSide: LorcanaPlayerSide,
): HandTuckState {
  return {
    ...state,
    [playerSide]: !state[playerSide],
  };
}
