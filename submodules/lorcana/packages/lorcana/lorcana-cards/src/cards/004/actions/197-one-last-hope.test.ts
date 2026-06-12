import { describe, expect, it } from "bun:test";
import type { MoveOptionTarget } from "@tcg/lorcana-engine";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { tinkerBellPeterPansAlly } from "../../001";
import { archimedesHighlyEducatedOwl } from "../../001/characters/036-archimedes-highly-educated-owl";
import { moanaChosenByTheOcean } from "../../001/characters/117-moana-chosen-by-the-ocean";
import { cobraBubblesJustASocialWorker } from "../../002/characters/004-cobra-bubbles-just-a-social-worker";
import { calhounMarineSergeant } from "../../006/characters/191-calhoun-marine-sergeant";
import { oneLastHope } from "./197-one-last-hope";

describe("One Last Hope", () => {
  it("gives a Hero Resist +2 and lets them challenge ready characters this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [oneLastHope],
      inkwell: oneLastHope.cost,
      play: [moanaChosenByTheOcean],
    });

    expect(
      testEngine.asPlayerOne().playCard(oneLastHope, { targets: [moanaChosenByTheOcean] }).success,
    ).toBe(true);
    expect(testEngine.getKeywordValue(moanaChosenByTheOcean, "Resist")).toBe(2);
    expect(testEngine.hasGrantedAbility(moanaChosenByTheOcean, "can-challenge-ready")).toBe(true);
  });

  it("only gives Resist +2 to a non-Hero", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [oneLastHope],
      inkwell: oneLastHope.cost,
      play: [tinkerBellPeterPansAlly],
    });

    expect(
      testEngine.asPlayerOne().playCard(oneLastHope, { targets: [tinkerBellPeterPansAlly] })
        .success,
    ).toBe(true);
    expect(testEngine.getKeywordValue(tinkerBellPeterPansAlly, "Resist")).toBe(2);
    expect(testEngine.hasGrantedAbility(tinkerBellPeterPansAlly, "can-challenge-ready")).toBe(
      false,
    );
  });

  it("can target an opponent's non-Hero character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [oneLastHope],
        inkwell: oneLastHope.cost,
        play: [tinkerBellPeterPansAlly],
      },
      {
        play: [calhounMarineSergeant, cobraBubblesJustASocialWorker],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(oneLastHope, { targets: [cobraBubblesJustASocialWorker] })
        .success,
    ).toBe(true);
    expect(testEngine.getKeywordValue(cobraBubblesJustASocialWorker, "Resist")).toBe(2);
    expect(testEngine.hasGrantedAbility(cobraBubblesJustASocialWorker, "can-challenge-ready")).toBe(
      false,
    );
  });

  it("Layer 2 offers all characters as targets when no singer is available", () => {
    // Use a cheap character (cost 1) that can't sing a cost-3 song
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [oneLastHope],
        inkwell: oneLastHope.cost,
        play: [archimedesHighlyEducatedOwl],
      },
      {
        play: [calhounMarineSergeant, cobraBubblesJustASocialWorker],
      },
    );

    const songInstanceId = testEngine.findCardInstanceId(oneLastHope, "hand");
    const moveOptions = testEngine.asPlayerOne().getMoveOptions("playCard", songInstanceId);
    const targetCardIds = moveOptions
      .filter((opt): opt is MoveOptionTarget => opt.kind === "card")
      .map((opt) => opt.cardId);

    // Should include all 3 characters: Archimedes, Calhoun (Hero), and Cobra Bubbles (non-Hero)
    expect(targetCardIds).toHaveLength(3);
  });

  it("can target an opponent's non-Hero when sung", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [oneLastHope],
        play: [cobraBubblesJustASocialWorker],
      },
      {
        play: [calhounMarineSergeant, tinkerBellPeterPansAlly],
      },
    );

    // Cobra Bubbles (cost 7) can sing One Last Hope (cost 3)
    expect(
      testEngine.asPlayerOne().singSong(oneLastHope, cobraBubblesJustASocialWorker),
    ).toBeSuccessfulCommand();

    // The pending effect should offer ALL characters as targets (not just Heroes)
    const pendingEffects = testEngine.asPlayerOne().getPendingEffects();
    expect(pendingEffects).toHaveLength(1);
    const selectionContext = pendingEffects[0]?.selectionContext;
    expect(selectionContext?.kind).toBe("target-selection");
    if (selectionContext?.kind === "target-selection") {
      // Should include all 3 characters: singer (Cobra Bubbles), opponent's Calhoun, and opponent's Tink
      expect(selectionContext.cardCandidateIds).toHaveLength(3);
    }

    // Resolve the pending effect targeting opponent's non-Hero
    expect(testEngine.asPlayerOne().respondWith(tinkerBellPeterPansAlly)).toBeSuccessfulCommand();

    expect(testEngine.getKeywordValue(tinkerBellPeterPansAlly, "Resist")).toBe(2);
    expect(testEngine.hasGrantedAbility(tinkerBellPeterPansAlly, "can-challenge-ready")).toBe(
      false,
    );
  });
});
