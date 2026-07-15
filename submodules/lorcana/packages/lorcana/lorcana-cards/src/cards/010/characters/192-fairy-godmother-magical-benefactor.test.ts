import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { fairyGodmotherMagicalBenefactor } from "./192-fairy-godmother-magical-benefactor";
import { simbaProtectiveCub, hakunaMatata, mickeyMouseTrueFriend } from "../../001";

describe("Fairy Godmother - Magical Benefactor", () => {
  it("Boost 3 {I} — has Boost keyword with value 3", () => {
    const boostAbility = (fairyGodmotherMagicalBenefactor.abilities ?? []).find(
      (a) => a.type === "keyword" && (a as { keyword?: string }).keyword === "Boost",
    );
    expect(boostAbility).toBeDefined();
    expect((boostAbility as { value?: number } | undefined)?.value).toBe(3);
  });

  it("Boost 3 {I} — can activate Boost 3 and puts top card of deck under this character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [fairyGodmotherMagicalBenefactor],
      deck: 5,
      inkwell: 10,
    });

    const deckBefore = testEngine.asPlayerOne().getZonesCardCount().deck;

    expect(
      testEngine
        .asPlayerOne()
        .activateAbility(fairyGodmotherMagicalBenefactor, { ability: "Boost" }),
    ).toBeSuccessfulCommand();

    const deckAfter = testEngine.asPlayerOne().getZonesCardCount().deck;
    expect(deckAfter).toBe(deckBefore - 1);
  });

  describe("STUNNING TRANSFORMATION — Whenever you put a card under this character, you may banish chosen opposing character. If you do, their player may reveal the top card of their deck. If that card is a character or item card, they may play it for free. Otherwise, they put it on the bottom of their deck.", () => {
    it("trigger fires when Boost puts a card under Fairy Godmother", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [fairyGodmotherMagicalBenefactor],
          deck: 5,
          inkwell: 10,
        },
        {
          play: [simbaProtectiveCub],
        },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(fairyGodmotherMagicalBenefactor, {
          ability: "Boost",
          preventAutoResolveTriggeredEffects: true,
        }),
      ).toBeSuccessfulCommand();

      // STUNNING TRANSFORMATION should be in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("top card is a character — opponent may play it for free", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [fairyGodmotherMagicalBenefactor],
          deck: 5,
          inkwell: 10,
        },
        {
          play: [simbaProtectiveCub],
          deck: [mickeyMouseTrueFriend],
        },
      );

      // Activate Boost to put a card under Fairy Godmother (triggers STUNNING TRANSFORMATION)
      expect(
        testEngine.asPlayerOne().activateAbility(fairyGodmotherMagicalBenefactor, {
          ability: "Boost",
          preventAutoResolveTriggeredEffects: true,
        }),
      ).toBeSuccessfulCommand();

      // P1 resolves the triggered bag effect — choose to banish Simba
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(fairyGodmotherMagicalBenefactor, {
          resolveOptional: true,
          targets: [simbaProtectiveCub],
        }),
      ).toBeSuccessfulCommand();

      // Simba should now be banished
      expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("discard");

      // P2 now gets a pending choice to distribute the scry'd card
      expect(
        testEngine.asPlayerTwo().resolveNextPending({
          destinations: [{ zone: "play", cards: [mickeyMouseTrueFriend] }],
        }),
      ).toBeSuccessfulCommand();

      // Mickey Mouse should now be in play for free
      expect(testEngine.asPlayerTwo().getCardZone(mickeyMouseTrueFriend)).toBe("play");
    });

    it("top card is an action — goes to bottom of opponent deck", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [fairyGodmotherMagicalBenefactor],
          deck: 5,
          inkwell: 10,
        },
        {
          play: [simbaProtectiveCub],
          deck: [hakunaMatata],
        },
      );

      // Activate Boost to put a card under Fairy Godmother (triggers STUNNING TRANSFORMATION)
      expect(
        testEngine.asPlayerOne().activateAbility(fairyGodmotherMagicalBenefactor, {
          ability: "Boost",
          preventAutoResolveTriggeredEffects: true,
        }),
      ).toBeSuccessfulCommand();

      // P1 resolves the triggered bag effect — choose to banish Simba
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(fairyGodmotherMagicalBenefactor, {
          resolveOptional: true,
          targets: [simbaProtectiveCub],
        }),
      ).toBeSuccessfulCommand();

      // Simba should now be banished
      expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("discard");

      // P2 resolves the scry — Hakuna Matata (action) cannot go to play, goes to deck-bottom via remainder
      expect(
        testEngine.asPlayerTwo().resolveNextPending({ destinations: [] }),
      ).toBeSuccessfulCommand();

      // Hakuna Matata (action) should remain in deck (put on bottom, not played)
      expect(testEngine.asPlayerTwo().getCardZone(hakunaMatata)).toBe("deck");
    });

    it("controller may decline to banish (optional — choosing not to banish)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [fairyGodmotherMagicalBenefactor],
          deck: 5,
          inkwell: 10,
        },
        {
          play: [simbaProtectiveCub],
        },
      );

      // Activate Boost — STUNNING TRANSFORMATION triggers
      expect(
        testEngine.asPlayerOne().activateAbility(fairyGodmotherMagicalBenefactor, {
          ability: "Boost",
          preventAutoResolveTriggeredEffects: true,
        }),
      ).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      // P1 declines to banish (resolveOptional: false means "no")
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(fairyGodmotherMagicalBenefactor, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      // Simba should still be in play
      expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("play");
    });
  });
});
