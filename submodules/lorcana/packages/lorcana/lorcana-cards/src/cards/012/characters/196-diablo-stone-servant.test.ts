import { describe, expect, it } from "bun:test";
import type { CommandFailure } from "@tcg/lorcana-engine";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { diabloStoneServant } from "./196-diablo-stone-servant";

const allyAlly = createMockCharacter({
  id: "diablo-stone-mock-ally",
  name: "Mock Ally",
  cost: 2,
  strength: 1,
  willpower: 3,
  classifications: ["Storyborn", "Ally"],
});

const villainAlly = createMockCharacter({
  id: "diablo-stone-mock-villain",
  name: "Mock Villain",
  cost: 2,
  strength: 2,
  willpower: 3,
  classifications: ["Storyborn", "Villain"],
});

const opposingAttacker = createMockCharacter({
  id: "diablo-stone-mock-attacker",
  name: "Mock Attacker",
  cost: 3,
  strength: 3,
  willpower: 4,
});

describe("Diablo - Stone Servant", () => {
  describe("CRUEL INTENT - While you have a Villain character in play, this character gets +2 {S} and +1 {L}.", () => {
    it("does not buff stats when no Villain is in play", () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: diabloStoneServant }, { card: allyAlly }],
      });

      const diabloId = engine.findCardInstanceId(diabloStoneServant, "play");
      expect(engine.asServer().getCard(diabloId).strength).toBe(diabloStoneServant.strength);
      expect(engine.asServer().getCard(diabloId).lore).toBe(diabloStoneServant.lore);
    });

    it("buffs strength by +2 and lore by +1 when a Villain is in play", () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: diabloStoneServant }, { card: villainAlly }],
      });

      const diabloId = engine.findCardInstanceId(diabloStoneServant, "play");
      expect(engine.asServer().getCard(diabloId).strength).toBe(
        (diabloStoneServant.strength ?? 0) + 2,
      );
      expect(engine.asServer().getCard(diabloId).lore).toBe((diabloStoneServant.lore ?? 0) + 1);
    });
  });

  describe("VILLAINOUS BOND - While this character is exerted, your Villain characters can't be challenged.", () => {
    it("prevents opposing characters from challenging your Villain when Diablo is exerted", () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: opposingAttacker, isDrying: false }],
        },
        {
          play: [
            { card: diabloStoneServant, exerted: true },
            { card: villainAlly, exerted: true },
          ],
        },
      );

      const result = engine
        .asPlayerOne()
        .challenge(opposingAttacker, villainAlly) as CommandFailure;

      expect(result.success).toBe(false);
    });

    it("allows challenges against your Villain when Diablo is ready (not exerted)", () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: opposingAttacker, isDrying: false }],
        },
        {
          play: [
            { card: diabloStoneServant, exerted: false },
            { card: villainAlly, exerted: true },
          ],
        },
      );

      expect(engine.asPlayerOne().challenge(opposingAttacker, villainAlly)).toBeSuccessfulCommand();
    });
  });
});
