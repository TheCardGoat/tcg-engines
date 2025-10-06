/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { mauricesWorkshop } from "../../002/items/168-maurices-workshop";
import { monsieurDArqueDespicableProprietor } from "./157-monsieur-darque-despicable-proprietor";

describe("Monsieur D'arque - Contemptible Owner", () => {
  it("I'M HERE TO COLLECT MY DUE Whenever this character is sent on an adventure, you can choose one of your items and banish it to draw a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: monsieurDArqueDespicableProprietor.cost,
      play: [monsieurDArqueDespicableProprietor, mauricesWorkshop],
    });

    // await testEngine.playCard(monsieurDArqueDespicableProprietor);
    const cardUnderTest = testEngine.getCardModel(
      monsieurDArqueDespicableProprietor,
    );
    const itemToBanish = testEngine.getCardModel(mauricesWorkshop);

    await testEngine.questCard(cardUnderTest);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({ targets: [itemToBanish] });

    expect(testEngine.getCardsByZone("hand").length).toBe(1);
    expect(itemToBanish.zone).toBe("discard");
  });
});
