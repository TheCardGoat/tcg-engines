/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { monsieurDArqueDespicableProprietor } from "@lorcanito/lorcana-engine/cards/007/characters/monsieurDArqueDespicableProprietor";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Monsieur D'arque - Contemptible Owner", () => {
  it.skip("I'M HERE TO COLLECT MY DUE Whenever this character is sent on an adventure, you can choose one of your items and banish it to draw a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: monsieurDArqueDespicableProprietor.cost,
      play: [monsieurDArqueDespicableProprietor],
      hand: [monsieurDArqueDespicableProprietor],
    });

    await testEngine.playCard(monsieurDArqueDespicableProprietor);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
