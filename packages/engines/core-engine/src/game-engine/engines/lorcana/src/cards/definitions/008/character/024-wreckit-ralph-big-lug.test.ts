/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { vanellopeVonSchweetzCandyMechanic } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";
import { wreckitRalphBigLug } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";

describe("Wreck-it Ralph - Big Lug", () => {
  it("Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Wreck-It Ralph.)", async () => {
    const testEngine = new TestEngine({
      play: [wreckitRalphBigLug],
    });

    const cardUnderTest = testEngine.getCardModel(wreckitRalphBigLug);
    expect(cardUnderTest.hasShift).toBe(true);
  });

  it("BACK ON TRACK When you play this character you may return a Racer character card with cost 6 or less from your discard to your hand. If you do, gain 1 lore.", async () => {
    const testEngine = new TestEngine({
      inkwell: wreckitRalphBigLug.cost,
      hand: [wreckitRalphBigLug],
      discard: [vanellopeVonSchweetzCandyMechanic],
      lore: 0,
    });

    await testEngine.playCard(wreckitRalphBigLug);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({
      targets: [vanellopeVonSchweetzCandyMechanic],
    });

    expect(
      testEngine.getCardModel(vanellopeVonSchweetzCandyMechanic).zone,
    ).toEqual("hand");
    expect(testEngine.getPlayerLore("player_one")).toEqual(1);
  });

  it("BACK ON TRACK - Play - No Lore when you cannot return card", async () => {
    const testEngine = new TestEngine({
      inkwell: wreckitRalphBigLug.cost,
      hand: [wreckitRalphBigLug],
      discard: [],
      lore: 0,
    });

    await testEngine.playCard(wreckitRalphBigLug);
    await testEngine.acceptOptionalLayer();
    expect(testEngine.stackLayers).toHaveLength(0);

    expect(testEngine.getPlayerLore("player_one")).toEqual(0);
  });

  it("BACK ON TRACK Whenever he quests you may return a Racer character card with cost 6 or less from your discard to your hand. If you do, gain 1 lore.", async () => {
    const testEngine = new TestEngine({
      inkwell: wreckitRalphBigLug.cost,
      play: [wreckitRalphBigLug],
      discard: [vanellopeVonSchweetzCandyMechanic],
      lore: 0,
    });

    await testEngine.questCard(wreckitRalphBigLug);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({
      targets: [vanellopeVonSchweetzCandyMechanic],
    });

    expect(
      testEngine.getCardModel(vanellopeVonSchweetzCandyMechanic).zone,
    ).toEqual("hand");

    //Quest Lore + ability Lore
    expect(testEngine.getPlayerLore("player_one")).toEqual(2);
  });

  it("BACK ON TRACK - Quest - No Lore when you cannot return card", async () => {
    const testEngine = new TestEngine({
      inkwell: wreckitRalphBigLug.cost,
      play: [wreckitRalphBigLug],
      discard: [],
      lore: 0,
    });

    await testEngine.questCard(wreckitRalphBigLug);
    expect(testEngine.stackLayers).toHaveLength(0);

    expect(testEngine.getPlayerLore("player_one")).toEqual(1);
  });
});
