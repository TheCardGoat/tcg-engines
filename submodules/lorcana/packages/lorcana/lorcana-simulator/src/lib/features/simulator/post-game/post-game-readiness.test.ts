import { describe, expect, it } from "bun:test";
import type { LorcanaProjectedBoardView } from "@tcg/lorcana-engine";
import { getTerminalPostGameBoard } from "./post-game-readiness.js";

describe("getTerminalPostGameBoard", () => {
  it("withholds the summary board until the terminal state update arrives", () => {
    const playingBoard = { stateID: 90, status: "playing" } as LorcanaProjectedBoardView;
    const finishedBoard = { ...playingBoard, stateID: 91, status: "finished" as const };

    // Match metadata may already report completion while the client still has
    // this playing board; that metadata is intentionally not an input here.
    expect(getTerminalPostGameBoard(playingBoard)).toBeNull();
    expect(getTerminalPostGameBoard(finishedBoard)).toBe(finishedBoard);
  });
});
