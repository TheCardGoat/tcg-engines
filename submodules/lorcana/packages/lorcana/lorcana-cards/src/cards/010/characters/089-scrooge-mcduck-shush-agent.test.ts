import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { scroogeMcduckShushAgent } from "./089-scrooge-mcduck-shush-agent";
import { dragonFire } from "../../001/actions/130-dragon-fire";

const drawnCard = createMockCharacter({
  id: "scrooge-shush-drawn-card",
  name: "Drawn Card",
  cost: 1,
});

const discardFodder = createMockCharacter({
  id: "scrooge-shush-discard-fodder",
  name: "Discard Fodder",
  cost: 1,
});

const strongAttacker = createMockCharacter({
  id: "scrooge-shush-strong-attacker",
  name: "Strong Attacker",
  cost: 5,
  strength: 5,
  willpower: 5,
});

describe("Scrooge McDuck - S.H.U.S.H. Agent", () => {
  describe("BACKUP PLAN - When you play this character, draw a card, then choose and discard a card.", () => {
    it("draws a card then discards a chosen card when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: scroogeMcduckShushAgent.cost,
        deck: [drawnCard],
        hand: [scroogeMcduckShushAgent, discardFodder],
      });

      const scroogeId = testEngine.findCardInstanceId(scroogeMcduckShushAgent, "hand");

      testEngine.asPlayerOne().playCard(scroogeId);

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(scroogeMcduckShushAgent, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getZonesCardCount()).toMatchObject({
        deck: 0,
        discard: 0,
        hand: 2,
        play: 1,
      });

      const discardFodderId = testEngine.findCardInstanceId(discardFodder, "hand", "player_one");
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [discardFodderId] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
      expect(testEngine.asPlayerOne().getZonesCardCount()).toMatchObject({
        deck: 0,
        discard: 1,
        hand: 1,
        play: 1,
      });
    });
  });

  describe("ON THE MOVE - When this character is challenged, return this card to your hand.", () => {
    it("returns to hand when challenged as a defender", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: scroogeMcduckShushAgent, exerted: true }],
          deck: 2,
        },
        {
          play: [strongAttacker],
          deck: 2,
        },
      );

      testEngine.asPlayerOne().passTurn();

      expect(
        testEngine.asPlayerTwo().challenge(strongAttacker, scroogeMcduckShushAgent),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(scroogeMcduckShushAgent),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(scroogeMcduckShushAgent)).toBe("hand");
      expect(testEngine.asPlayerTwo().getCardZone(strongAttacker)).toBe("play");
    });

    it("does NOT return to hand when challenging as an attacker (only when being challenged)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [scroogeMcduckShushAgent],
          deck: 2,
        },
        {
          play: [{ card: strongAttacker, exerted: true }],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(scroogeMcduckShushAgent, strongAttacker),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);

      expect(testEngine.asPlayerOne().getCardZone(scroogeMcduckShushAgent)).toBe("discard");
    });

    it("does NOT return to hand when banished outside a challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [scroogeMcduckShushAgent],
          deck: 2,
        },
        {
          hand: [dragonFire],
          inkwell: dragonFire.cost,
          deck: 2,
        },
      );

      testEngine.asPlayerOne().passTurn();

      expect(
        testEngine.asPlayerTwo().playCard(dragonFire, { targets: [scroogeMcduckShushAgent] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(scroogeMcduckShushAgent)).toBe("discard");
    });
  });
});
