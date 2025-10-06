/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { bobbyZimuruskiSprayCheeseKid } from "~/game-engine/engines/lorcana/src/cards/definitions/009";

describe("Bobby Zimuruski - Spray Cheese Kid", () => {
  it.skip("SO CHEESY When you play this character, you may draw a card, then choose and discard a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: bobbyZimuruskiSprayCheeseKid.cost,
      hand: [bobbyZimuruskiSprayCheeseKid],
    });

    await testEngine.playCard(bobbyZimuruskiSprayCheeseKid);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({});
  });
});
