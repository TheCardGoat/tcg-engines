/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  dormouseEasilyAgitated,
  madameMedusaDeceivingPartner,
  mickeyMouseGiantMouse,
} from "@lorcanito/lorcana-engine/cards/008";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Madame Medusa - Deceiving Partner", () => {
  it("DOUBLE-CROSS When you play this character, you may deal 2 damage to another chosen character of yours to return chosen character with cost 2 or less to their player's hand.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: madameMedusaDeceivingPartner.cost,
        hand: [madameMedusaDeceivingPartner],
        play: [mickeyMouseGiantMouse],
      },
      {
        play: [dormouseEasilyAgitated],
      },
    );

    await testEngine.playCard(
      madameMedusaDeceivingPartner,
      {
        targets: [mickeyMouseGiantMouse],
        acceptOptionalLayer: true,
      },
      true,
    );
    await testEngine.resolveTopOfStack({ targets: [dormouseEasilyAgitated] });

    expect(testEngine.getCardModel(dormouseEasilyAgitated).zone).toBe("hand");
  });
});
