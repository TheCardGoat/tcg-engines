/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  deweyLovableShowoff,
  hueyReliableLeader,
  magicaDeSpellShadowForm,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";

describe("Magica De Spell - Shadow Form", () => {
  it("Evasive (Only characters with Evasive can challenge this character.)", async () => {
    const testEngine = new TestEngine({
      play: [magicaDeSpellShadowForm],
    });

    const cardUnderTest = testEngine.getCardModel(magicaDeSpellShadowForm);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it("DANCE OF DARKNESS When you play this character, you may return one of your other characters to your hand to draw a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: magicaDeSpellShadowForm.cost,
      hand: [magicaDeSpellShadowForm],
      play: [deweyLovableShowoff],
      deck: [hueyReliableLeader],
    });

    await testEngine.playCard(magicaDeSpellShadowForm, {
      acceptOptionalLayer: true,
      targets: [deweyLovableShowoff],
    });

    await expect(testEngine.getCardModel(deweyLovableShowoff).zone).toBe(
      "hand",
    );
    await expect(testEngine.getCardModel(hueyReliableLeader).zone).toBe("hand");
  });

  it("DANCE OF DARKNESS When you play this character, you may return one of your OTHER characters to your hand to draw a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: magicaDeSpellShadowForm.cost,
      hand: [magicaDeSpellShadowForm],
      play: [],
      deck: [hueyReliableLeader],
    });

    await testEngine.playCard(
      magicaDeSpellShadowForm,
      {
        acceptOptionalLayer: true,
        targets: [magicaDeSpellShadowForm],
      },
      true,
    );

    await expect(testEngine.getCardModel(magicaDeSpellShadowForm).zone).toBe(
      "play",
    );
  });
});
