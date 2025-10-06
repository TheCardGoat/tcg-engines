/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  basilPracticedDetective,
  tipoGrowingSon,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

describe("Tipo - Growing Son", () => {
  it("**MEASURE ME AGAIN** When you play this character, you may put a card from your hand into your inkwell facedown and exerted.", () => {
    const testStore = new TestStore({
      inkwell: tipoGrowingSon.cost,
      hand: [tipoGrowingSon, basilPracticedDetective],
    });

    const cardUnderTest = testStore.getCard(tipoGrowingSon);
    const target = testStore.getCard(basilPracticedDetective);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(testStore.getZonesCardCount().inkwell).toEqual(
      tipoGrowingSon.cost + 1,
    );
  });
});
