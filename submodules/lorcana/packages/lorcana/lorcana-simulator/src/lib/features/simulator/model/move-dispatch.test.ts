import { describe, expect, it } from "bun:test";
import { m } from "$lib/i18n/messages.js";
import type { CommandResult, LorcanaEngineBase } from "@tcg/lorcana-engine";

import { buildPendingMoveError, dispatchSimulatorMove } from "./move-dispatch.js";

type DispatchCall = {
  moveId: string;
  playerId: string;
  params: Record<string, unknown>;
};

function createSpyEngine(result: CommandResult): {
  engine: LorcanaEngineBase;
  calls: DispatchCall[];
} {
  const calls: DispatchCall[] = [];
  const engine = {
    dispatch: (moveId: string, playerId: string, params: Record<string, unknown>) => {
      calls.push({ moveId, playerId, params });
      return result;
    },
  } as unknown as LorcanaEngineBase;
  return { engine, calls };
}

describe("dispatchSimulatorMove", () => {
  it("forwards moveId, playerId, and params verbatim to engine.dispatch", () => {
    const expected: CommandResult = { success: true } as CommandResult;
    const { engine, calls } = createSpyEngine(expected);

    const result = dispatchSimulatorMove(engine, "player_one", "playCard", {
      cardId: "my-card",
      cost: "standard",
      targets: ["target-a"],
    });

    expect(result).toBe(expected);
    expect(calls).toEqual([
      {
        moveId: "playCard",
        playerId: "player_one",
        params: { cardId: "my-card", cost: "standard", targets: ["target-a"] },
      },
    ]);
  });

  it("returns the engine's CommandResult unchanged (including failures)", () => {
    const failure: CommandResult = {
      success: false,
      error: "not your turn",
      errorCode: "NOT_YOUR_TURN",
      currentStateID: 0,
    };
    const { engine } = createSpyEngine(failure);

    const result = dispatchSimulatorMove(engine, "player_two", "passTurn", {});

    expect(result).toBe(failure);
  });
});

describe("buildPendingMoveError", () => {
  it("classifies candidate-list / no-longer-available reasons as moveNoLongerLegal", () => {
    const variants = [
      "No longer available for targeting",
      "The chosen target is not in the candidate list",
      "Ability is not currently available",
    ];

    for (const reason of variants) {
      const err = buildPendingMoveError("playCard", { cardId: "x" }, reason);
      expect(err.message).toBe(m["sim.errors.execution.moveNoLongerLegal"]({}));
      expect(err.moveId).toBe("playCard");
      expect(err.rawReason).toBe(reason);
      expect(err.params).toEqual({ cardId: "x" });
    }
  });

  it("classifies INVALID_MOVE code as execution.invalidMove when reason doesn't match keywords", () => {
    const err = buildPendingMoveError("playCard", {}, "unexpected", "INVALID_MOVE");
    expect(err.message).toBe(m["sim.errors.execution.invalidMove"]({}));
    expect(err.code).toBe("INVALID_MOVE");
  });

  it("falls back to the generic moveCannotExecute message for uncategorized errors", () => {
    const err = buildPendingMoveError("playCard", {}, "something else entirely");
    expect(err.message).toBe(m["sim.errors.moveCannotExecute"]({}));
    expect(err.rawReason).toBe("something else entirely");
  });

  it("omits rawReason when the reason is empty or whitespace-only", () => {
    expect(buildPendingMoveError("playCard", {}, "").rawReason).toBeUndefined();
    expect(buildPendingMoveError("playCard", {}, "   ").rawReason).toBeUndefined();
    expect(buildPendingMoveError("playCard", {}).rawReason).toBeUndefined();
  });

  it("prefers keyword classification over code when both are present", () => {
    // Reason keyword takes priority — engine may return a generic code alongside a
    // specific reason, and the user-facing message should follow the reason.
    const err = buildPendingMoveError(
      "playCard",
      {},
      "Target is no longer available",
      "INVALID_MOVE",
    );
    expect(err.message).toBe(m["sim.errors.execution.moveNoLongerLegal"]({}));
    expect(err.code).toBe("INVALID_MOVE");
  });
});
