import { expect, test } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { AutomatedMatchPlaybackReadModel } from "@/features/simulator-devtools/ai-match/playback-controller.js";

test.each(["player_one", "player_two"])(
  "practice setup can choose %s without breaking its log subscriber",
  (firstPlayer: "player_one" | "player_two") => {
    const inkable = createMockCharacter({
      id: "practice-inkable",
      name: "Practice Character",
      cost: 1,
      inkable: true,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: Array.from({ length: 60 }, () => inkable) },
      { deck: Array.from({ length: 60 }, () => inkable) },
      {
        skipPreGame: false,
        capturePatches: false,
        validateSync: false,
        timeControl: { mode: "none" },
      },
    );
    const readModel = new AutomatedMatchPlaybackReadModel(engine);
    let notificationCount = 0;
    const unsubscribe = readModel.subscribeStateUpdates(() => {
      readModel.getMoveLog(50, "playerOne");
      notificationCount += 1;
    });
    try {
      expect(
        engine.asPlayerOne().dispatch("chooseWhoGoesFirst", "player_one", {
          playerId: firstPlayer,
        }),
      ).toBeSuccessfulCommand();
      expect(notificationCount).toBeGreaterThan(0);
      expect(readModel.getMoveLog(50, "playerOne").map((entry) => entry.moveId)).toEqual([
        "chooseWhoGoesFirst",
      ]);
      expect(engine.asServer().getCurrentPhase()).toBe("mulligan");
      for (let i = 0; i < 2; i += 1) {
        const actorId = engine.asServer().getCurrentActorId();
        const player = actorId === "player_one" ? engine.asPlayerOne() : engine.asPlayerTwo();
        expect(player.mulligan([])).toBeSuccessfulCommand();
      }
      const first = firstPlayer === "player_one" ? engine.asPlayerOne() : engine.asPlayerTwo();
      const cardId = first.getBoard().players[firstPlayer]!.hand[0]!;
      expect(first.ink(cardId)).toBeSuccessfulCommand();
      expect(readModel.getMoveLog(50, "playerOne").map((entry) => entry.moveId)).toEqual([
        "chooseWhoGoesFirst",
        "alterHand",
        "alterHand",
        "putCardIntoInkwell",
      ]);
    } finally {
      unsubscribe();
      readModel.dispose();
      engine.dispose();
    }
  },
);
