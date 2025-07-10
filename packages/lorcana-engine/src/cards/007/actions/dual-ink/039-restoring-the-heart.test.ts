/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { arielSpectacularSinger } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { theQueensCastleMirrorChamber } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
import { tipoGrowingSon } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { restoringTheHeart } from "@lorcanito/lorcana-engine/cards/007/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Restoring The Heart", () => {
  it("Draw a card", async () => {
    const testEngine = new TestEngine({
      inkwell: restoringTheHeart.cost,
      hand: [restoringTheHeart],
      deck: [tipoGrowingSon],
    });

    await testEngine.playCard(restoringTheHeart);

    expect(testEngine.getZonesCardCount().hand).toEqual(1);
  });

  it("Remove up to 3 damage from chosen character", async () => {
    const testEngine = new TestEngine({
      inkwell: restoringTheHeart.cost,
      hand: [restoringTheHeart],
      deck: [arielSpectacularSinger],
      play: [tipoGrowingSon],
    });

    const tipo = testEngine.getCardModel(tipoGrowingSon);

    tipo.updateCardDamage(2, "add");

    await testEngine.playCard(restoringTheHeart);

    expect(tipo.damage).toBe(0);
  });

  it("Remove up to 3 damage from chosen location", async () => {
    const testEngine = new TestEngine({
      inkwell: restoringTheHeart.cost,
      hand: [restoringTheHeart],
      deck: [arielSpectacularSinger],
      play: [theQueensCastleMirrorChamber],
    });

    const location = testEngine.getCardModel(theQueensCastleMirrorChamber);

    location.updateCardDamage(3, "add");

    await testEngine.playCard(restoringTheHeart);
    await testEngine.resolveTopOfStack({ targets: [location] });

    expect(location.damage).toBe(0);
  });

  it("No targets available should give you a card draw", async () => {
    const testEngine = new TestEngine({
      inkwell: restoringTheHeart.cost,
      hand: [restoringTheHeart],
      deck: 4,
    });

    await testEngine.playCard(restoringTheHeart);

    expect(testEngine.getZonesCardCount().hand).toEqual(1);
    expect(testEngine.getZonesCardCount().deck).toEqual(3);
  });
});
