import { describe, expect, it } from "bun:test";
import { createMockCharacter, LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { balooCarefreeBear } from "./085-baloo-carefree-bear";

const filler = createMockCharacter({
  id: "baloo-test-filler",
  name: "Filler Card",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const fillerTwo = createMockCharacter({
  id: "baloo-test-filler-two",
  name: "Filler Card Two",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Baloo - Carefree Bear", () => {
  it("has shift 3", () => {
    const shiftAbility = (balooCarefreeBear.abilities ?? []).find(
      (a) => a.type === "keyword" && a.keyword === "Shift",
    );
    expect(shiftAbility).toBeDefined();
    expect(shiftAbility!.cost).toEqual({ ink: 3 });
  });

  describe("ROLL WITH IT - When you play this character, choose one", () => {
    it("mode 0: Each player draws a card", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: balooCarefreeBear.cost,
          hand: [balooCarefreeBear],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(balooCarefreeBear)).toBeSuccessfulCommand();

      // Choose mode 0: Each player draws a card
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(balooCarefreeBear, { choiceIndex: 0 }),
      ).toBeSuccessfulCommand();

      // Both players should have drawn a card
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
      expect(testEngine.asPlayerTwo().getZonesCardCount().hand).toBe(1);
    });

    it("mode 1: Each player chooses and discards a card", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: balooCarefreeBear.cost,
          hand: [balooCarefreeBear, filler],
        },
        {
          hand: [fillerTwo],
        },
      );

      expect(testEngine.asPlayerOne().playCard(balooCarefreeBear)).toBeSuccessfulCommand();

      // Choose mode 1: Each player chooses and discards a card
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(balooCarefreeBear, { choiceIndex: 1 }),
      ).toBeSuccessfulCommand();

      // Player one should choose and discard a card from hand
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [filler] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(filler)).toBe("discard");

      // Player two should also choose and discard
      expect(
        testEngine.asPlayerTwo().resolveNextPending({ targets: [fillerTwo] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(filler)).toBe("discard");
    });
  });

  it("regression: ROLL WITH IT ability should trigger and create a bag effect when played", () => {
    // Bug: Baloo's ROLL WITH IT ability was not working at all.
    // When played, the triggered ability should fire and offer a choice.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: balooCarefreeBear.cost,
        hand: [balooCarefreeBear],
        deck: 5,
      },
      {
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().playCard(balooCarefreeBear)).toBeSuccessfulCommand();

    // The ability should create a bag effect with a choice
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
  });
});
