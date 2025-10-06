/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  kashekimAncientRuler,
  sapphireCoil,
  suzyMasterSeamstress,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";

describe("Sapphire Coil", () => {
  it("BRILLIANT SHINE During your turn, whenever a card is put into your inkwell, you may give chosen character -2 {S} this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: sapphireCoil.cost,
      play: [sapphireCoil, kashekimAncientRuler],
      hand: [suzyMasterSeamstress],
    });
    const target = testEngine.getCardModel(kashekimAncientRuler);

    expect(target.strength).toBe(kashekimAncientRuler.strength);

    await testEngine.putIntoInkwell(suzyMasterSeamstress);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({ targets: [kashekimAncientRuler] });

    expect(target.strength).toBe(kashekimAncientRuler.strength - 2);
  });
});
