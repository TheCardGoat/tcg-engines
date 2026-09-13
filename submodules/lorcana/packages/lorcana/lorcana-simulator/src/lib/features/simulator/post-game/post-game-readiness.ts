import type { LorcanaProjectedBoardView } from "@tcg/lorcana-engine";

/** A post-game summary is safe to open only after the terminal board arrives. */
export function getTerminalPostGameBoard(
  board: LorcanaProjectedBoardView | null,
): LorcanaProjectedBoardView | null {
  return board?.status === "finished" ? board : null;
}
