import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { scroogeMcduckRichestDuckInTheWorld } from "./154-scrooge-mcduck-richest-duck-in-the-world";

const weakDefender = createMockCharacter({
  id: "scrooge-weak-defender",
  name: "Weak Defender",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const cheapItem = createMockItem({
  id: "scrooge-cheap-item",
  name: "Cheap Item",
  cost: 3,
});

const evasiveDefender = createMockCharacter({
  id: "scrooge-evasive-defender",
  name: "Evasive Defender",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
  abilities: [
    {
      id: "scrooge-evasive-defender-kw",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
  ],
});

describe("Scrooge McDuck - Richest Duck in the World", () => {
  describe("I'M GOING HOME! — During your turn, this character gains Evasive.", () => {
    it("has Evasive during your turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [scroogeMcduckRichestDuckInTheWorld],
      });

      expect(
        testEngine.asPlayerOne().hasKeyword(scroogeMcduckRichestDuckInTheWorld, "Evasive"),
      ).toBe(true);
    });

    it("does not have Evasive during opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [scroogeMcduckRichestDuckInTheWorld],
      });

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().hasKeyword(scroogeMcduckRichestDuckInTheWorld, "Evasive"),
      ).toBe(false);
    });

    it("can challenge Evasive characters during your turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [scroogeMcduckRichestDuckInTheWorld],
        },
        {
          play: [{ card: evasiveDefender, exerted: true }],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(scroogeMcduckRichestDuckInTheWorld, evasiveDefender),
      ).toBeSuccessfulCommand();
    });
  });

  describe("I DIDN'T GET RICH BY BEING STUPID — During your turn, whenever this character banishes another character in a challenge, you may play an item for free.", () => {
    it("triggers when Scrooge banishes an opponent's character in a challenge and plays an item for free", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [scroogeMcduckRichestDuckInTheWorld],
          hand: [cheapItem],
          inkwell: 0,
          deck: 1,
        },
        {
          play: [{ card: weakDefender, exerted: true }],
          deck: 1,
        },
      );

      const cheapItemId = testEngine.findCardInstanceId(cheapItem, "hand", PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().challenge(scroogeMcduckRichestDuckInTheWorld, weakDefender),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(weakDefender)).toBe("discard");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(scroogeMcduckRichestDuckInTheWorld, {
          resolveOptional: true,
          targets: [cheapItemId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(cheapItem)).toBe("play");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("allows declining the optional trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [scroogeMcduckRichestDuckInTheWorld],
          hand: [cheapItem],
          deck: 1,
        },
        {
          play: [{ card: weakDefender, exerted: true }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(scroogeMcduckRichestDuckInTheWorld, weakDefender),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(scroogeMcduckRichestDuckInTheWorld, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(cheapItem)).toBe("hand");
    });

    it("does not trigger when another character banishes an opponent's character", () => {
      const otherAttacker = createMockCharacter({
        id: "scrooge-other-attacker",
        name: "Other Attacker",
        cost: 3,
        strength: 5,
        willpower: 5,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [scroogeMcduckRichestDuckInTheWorld, otherAttacker],
          hand: [cheapItem],
          deck: 1,
        },
        {
          play: [{ card: weakDefender, exerted: true }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(otherAttacker, weakDefender),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(weakDefender)).toBe("discard");

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getCardZone(cheapItem)).toBe("hand");
    });
  });
});
