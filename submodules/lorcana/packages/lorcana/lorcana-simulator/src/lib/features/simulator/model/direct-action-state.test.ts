import { describe, expect, it, mock } from "bun:test";
import {
  clearPendingDirectMoveIfUnavailable,
  isConfirmableDirectMoveCategoryId,
  togglePendingDirectMove,
  type PendingDirectMove,
} from "./direct-action-state.js";
import type { ExecutableMoveEntry } from "@/features/simulator/model/contracts.js";

function createDirectMove(
  categoryId: "pass-turn" | "quest-all" | "undo",
  overrides: Partial<ExecutableMoveEntry> = {},
): ExecutableMoveEntry {
  return {
    id: overrides.id ?? `${categoryId}:1`,
    label: overrides.label ?? categoryId,
    moveId: "passTurn",
    params: {},
    presentation: {
      kind: "direct",
      categoryId,
      categoryLabel: overrides.label ?? categoryId,
    },
    ...overrides,
  } as ExecutableMoveEntry;
}

describe("direct-action-state", () => {
  it("recognizes confirmable direct-action categories", () => {
    expect(isConfirmableDirectMoveCategoryId("pass-turn")).toBe(true);
    expect(isConfirmableDirectMoveCategoryId("quest-all")).toBe(true);
    expect(isConfirmableDirectMoveCategoryId("undo")).toBe(true);
    expect(isConfirmableDirectMoveCategoryId("play-card")).toBe(false);
  });

  it("arms a confirmable direct move on first activation", () => {
    const execute = mock(() => {});
    const result = togglePendingDirectMove(
      null,
      createDirectMove("pass-turn", { label: "Pass Turn" }),
      execute,
      "keyboard",
    );

    expect(result.shouldExecuteImmediately).toBe(false);
    expect(result.nextPendingDirectMove).toEqual({
      id: "pass-turn:1",
      label: "Pass Turn",
      categoryId: "pass-turn",
      source: "keyboard",
      execute,
    });
  });

  it("executes a confirmable direct move on second activation", () => {
    const execute = mock(() => {});
    const move = createDirectMove("quest-all", { label: "Quest with All for 4 lore" });
    const pendingDirectMove: PendingDirectMove = {
      id: move.id,
      label: move.label,
      categoryId: "quest-all",
      source: "pointer",
      execute,
    };

    const result = togglePendingDirectMove(pendingDirectMove, move, execute, "pointer");

    expect(result.shouldExecuteImmediately).toBe(true);
    expect(result.nextPendingDirectMove).toBeNull();
  });

  it("clears a pending direct move when its category is no longer available", () => {
    const pendingDirectMove: PendingDirectMove = {
      id: "pass-turn:1",
      label: "Pass Turn",
      categoryId: "pass-turn",
      source: "pointer",
      execute: () => {},
    };

    expect(
      clearPendingDirectMoveIfUnavailable(pendingDirectMove, new Set(["quest-all"])),
    ).toBeNull();
    expect(
      clearPendingDirectMoveIfUnavailable(pendingDirectMove, new Set(["pass-turn", "quest-all"])),
    ).toEqual(pendingDirectMove);
  });
});
