import { describe, expect, it } from "vite-plus/test";
import { createMatch, createSt01MirrorPracticeConfig } from "@tcg/op-engine";
import type { MatchState } from "@tcg/op-engine";
import type { DispatchContext } from "@tcg/shared/game-engine";
import { OnePieceServerEngine } from "./one-piece-server-engine.js";

const context: DispatchContext = {
  gameId: "one-piece-test-game",
  sourceAuthority: "server",
};

describe("OnePieceServerEngine", () => {
  it("routes setup actions through the server adapter", () => {
    const engine = new OnePieceServerEngine(
      createMatch(createSt01MirrorPracticeConfig({ firstPlayer: "south" })),
      {
        player1: "south",
        player2: "north",
      },
    );

    const southChoice = engine.dispatch("chooseJoKenPo", "player1", { choice: "paper" }, context);

    expect(southChoice.success).toBe(true);
    if (!southChoice.success) throw new Error(southChoice.error);
    const southChoiceState = southChoice.state as MatchState;
    expect(southChoiceState.setup.joKenPo.pendingSeats).toEqual(["south"]);
    expect(southChoiceState.setup.joKenPo.hiddenChoices).toEqual({ south: "hidden" });
    expect(southChoiceState.setup.joKenPo.choices).toEqual({});
    expect(engine.state.setup.joKenPo.hiddenChoices).toEqual({ south: "paper" });
    expect(JSON.stringify(southChoice.patches)).not.toContain("paper");
    expect(JSON.stringify(southChoice.patches)).toContain("hidden");
    expect(southChoice.patches).toContainEqual(
      expect.objectContaining({
        path: ["setup", "joKenPo", "hiddenChoices"],
        value: { south: "hidden" },
      }),
    );
    expect(JSON.stringify(southChoice.acceptedMoveRecord.input)).not.toContain("paper");
    expect(JSON.stringify(southChoice.acceptedMoveRecord.processedCommand)).not.toContain("paper");

    const northChoice = engine.dispatch("chooseJoKenPo", "player2", { choice: "rock" }, context);
    const firstPlayer = engine.dispatch(
      "chooseFirstPlayer",
      "player1",
      { firstPlayer: "north" },
      context,
    );
    const southKeep = engine.dispatch("keepHand", "player1", {}, context);
    const northKeep = engine.dispatch("keepHand", "player2", {}, context);
    const started = engine.dispatch("startGame", "player2", {}, context);

    expect(northChoice.success).toBe(true);
    if (!northChoice.success) throw new Error(northChoice.error);
    const northChoiceState = northChoice.state as MatchState;
    expect(northChoiceState.setup.joKenPo.pendingSeats).toEqual([]);
    expect(northChoiceState.setup.joKenPo.hiddenChoices).toEqual({});
    expect(northChoiceState.setup.joKenPo.choices).toEqual({
      north: "rock",
      south: "paper",
    });
    expect(firstPlayer.success).toBe(true);
    expect(southKeep.success).toBe(true);
    expect(northKeep.success).toBe(true);
    expect(started.success).toBe(true);
    expect(engine.state.status).toBe("active");
    expect(engine.state.activeSeat).toBe("north");
  });
});
