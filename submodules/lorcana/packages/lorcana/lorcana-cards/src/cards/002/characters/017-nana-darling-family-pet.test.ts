import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { nanaDarlingFamilyPet } from "./017-nana-darling-family-pet";
import { cinderellaStouthearted } from "./177-cinderella-stouthearted";
import { gastonBaritoneBully } from "./008-gaston-baritone-bully";

describe("Nana - Darling Family Pet", () => {
  describe("NURSEMAID — Whenever you play a Floodborn character, you may remove all damage from chosen character.", () => {
    it("triggers when you play a Floodborn character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: nanaDarlingFamilyPet, damage: 2 },
          { card: gastonBaritoneBully, damage: 3 },
        ],
        hand: [
          { card: cinderellaStouthearted }, // Floodborn
        ],
        inkwell: Array.from({ length: 10 }).map(() => ({ card: gastonBaritoneBully })), // Lots of ink
      });

      const nanaId = testEngine.findCardInstanceId(nanaDarlingFamilyPet, "play");
      const gastonId = testEngine.findCardInstanceId(gastonBaritoneBully, "play");
      const cinderellaId = testEngine.findCardInstanceId(cinderellaStouthearted, "hand");

      // Play Floodborn
      testEngine.asPlayerOne().playCard(cinderellaId);

      // Should have trigger
      testEngine.asPlayerOne().resolvePendingByCard(nanaDarlingFamilyPet);

      // Target a character to heal (Gaston)
      let pendingChoice = testEngine.asPlayerOne().getPendingChoice();
      if (pendingChoice) {
        testEngine.asPlayerOne().resolveNextPending({ targets: [gastonId] });
      }

      // Gaston should be healed completely
      const gaston = testEngine.asServer().getCard(gastonId);
      expect(gaston.damage).toBe(0);

      // Nana should still have 2 damage
      const nana = testEngine.asServer().getCard(nanaId);
      expect(nana.damage).toBe(2);
    });

    it("does not trigger when you play a non-Floodborn character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: nanaDarlingFamilyPet, damage: 2 }],
        hand: [{ card: gastonBaritoneBully }], // Dreamborn, not Floodborn
        inkwell: Array.from({ length: 5 }).map(() => ({ card: gastonBaritoneBully })),
      });

      const gastonHandId = testEngine.findCardInstanceId(gastonBaritoneBully, "hand");
      testEngine.asPlayerOne().playCard(gastonHandId);

      // NURSEMAID should not trigger since Gaston is not Floodborn
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("does not trigger when opponent plays a Floodborn character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [{ card: nanaDarlingFamilyPet, damage: 2 }] },
        {
          hand: [{ card: cinderellaStouthearted }],
          inkwell: Array.from({ length: 10 }).map(() => ({ card: gastonBaritoneBully })),
        },
      );

      const cinderellaId = testEngine.findCardInstanceId(
        cinderellaStouthearted,
        "hand",
        "player_two",
      );
      testEngine.asPlayerTwo().playCard(cinderellaId);

      // NURSEMAID should not trigger since the opponent played the Floodborn
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
