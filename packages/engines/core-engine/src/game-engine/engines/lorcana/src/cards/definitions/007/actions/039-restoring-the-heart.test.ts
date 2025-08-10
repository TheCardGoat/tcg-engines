import { describe, expect, it } from "bun:test";
import { arielSpectacularSinger } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { theQueensCastleMirrorChamber } from "~/game-engine/engines/lorcana/src/cards/definitions/003/locations";
import { tipoGrowingSon } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters";
import { restoringTheHeart } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Restoring The Heart", () => {
  it.skip("Draw a card", async () => {
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

  it.skip("No targets available should give you a card draw", async () => {
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
