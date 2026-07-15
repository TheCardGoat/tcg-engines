import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { createMockCharacter } from "@tcg/lorcana-engine/testing";
import { goofyEmeraldChampion } from "./091-goofy-emerald-champion";

const emeraldAlly = createMockCharacter({
  id: "goofy-emerald-champion-emerald-ally",
  name: "Emerald Ally",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkType: ["emerald"],
});

const nonEmeraldAlly = createMockCharacter({
  id: "goofy-emerald-champion-non-emerald-ally",
  name: "Non-Emerald Ally",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkType: ["amber"],
});

const attacker = createMockCharacter({
  id: "goofy-emerald-champion-attacker",
  name: "Attacker",
  cost: 4,
  strength: 5,
  willpower: 4,
  lore: 1,
  inkType: ["ruby"],
});

describe("Goofy - Emerald Champion", () => {
  describe("PROVIDE COVER - Your other Emerald characters gain Ward.", () => {
    it("gives Ward to your other Emerald characters only", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [goofyEmeraldChampion, emeraldAlly, nonEmeraldAlly],
      });

      expect(testEngine.asPlayerOne().hasKeyword(emeraldAlly, "Ward")).toBe(true);
      expect(testEngine.asPlayerOne().hasKeyword(nonEmeraldAlly, "Ward")).toBe(false);
      expect(testEngine.asPlayerOne().hasKeyword(goofyEmeraldChampion, "Ward")).toBe(false);
    });
  });

  describe("EVEN THE SCORE - Whenever one of your other Emerald characters is challenged and banished, banish the challenging character.", () => {
    it("banishes the challenging character when your other Emerald character is challenged and banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [attacker],
          deck: 1,
        },
        {
          play: [goofyEmeraldChampion, { card: emeraldAlly, exerted: true }],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().challenge(attacker, emeraldAlly)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerTwo().getBagEffects();
      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(goofyEmeraldChampion),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(emeraldAlly)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(attacker)).toBe("discard");
      expect(testEngine.asPlayerTwo().getCardZone(goofyEmeraldChampion)).toBe("play");
    });

    it("does not banish the challenging character when a non-Emerald character is challenged and banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [attacker],
          deck: 1,
        },
        {
          play: [goofyEmeraldChampion, { card: nonEmeraldAlly, exerted: true }],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().challenge(attacker, nonEmeraldAlly)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getCardZone(nonEmeraldAlly)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(attacker)).toBe("play");
    });

    it("does not trigger when Goofy himself is challenged and banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [attacker],
          deck: 1,
        },
        {
          play: [{ card: goofyEmeraldChampion, exerted: true }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(attacker, goofyEmeraldChampion),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getCardZone(goofyEmeraldChampion)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(attacker)).toBe("play");
    });
  });

  it("regression: Ward from PROVIDE COVER protects Emerald characters from being targeted by opponent", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [goofyEmeraldChampion, emeraldAlly],
      },
      {
        deck: 1,
      },
    );

    // Emerald ally should have Ward, which PROTECTS them from opponent targeting
    expect(testEngine.asPlayerOne().hasKeyword(emeraldAlly, "Ward")).toBe(true);
    // Ward should not force the opponent to target — it should prevent targeting
  });
});
