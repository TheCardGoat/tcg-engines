/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  amberCoil,
  kashekimAncientRuler,
  kodaSmallishBear,
  suzyMasterSeamstress,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";

describe("Amber Coil", () => {
  it("HEALING AURA During your turn, whenever a card is put into your inkwell, you may remove up to 2 damage from chosen character.", async () => {
    const testEngine = new TestEngine({
      play: [amberCoil, kashekimAncientRuler, kodaSmallishBear],
      hand: [suzyMasterSeamstress],
    });

    await testEngine.setCardDamage(kashekimAncientRuler, 2);

    await testEngine.putIntoInkwell(suzyMasterSeamstress);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({ targets: [kashekimAncientRuler] });

    expect(testEngine.getCardModel(kashekimAncientRuler).damage).toBe(0);
  });
});
