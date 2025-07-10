/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  kashekimAncientRuler,
  rubyCoil,
  suzyMasterSeamstress,
} from "@lorcanito/lorcana-engine/cards/007";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Ruby Coil", () => {
  it("CRIMSON SPARK During your turn, whenever a card is put into your inkwell, chosen character gets +2 {S} this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: rubyCoil.cost,
      play: [rubyCoil, kashekimAncientRuler],
      hand: [suzyMasterSeamstress],
    });
    const target = testEngine.getCardModel(kashekimAncientRuler);

    expect(target.strength).toBe(kashekimAncientRuler.strength);

    await testEngine.putIntoInkwell(suzyMasterSeamstress);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({ targets: [kashekimAncientRuler] });

    expect(target.strength).toBe(kashekimAncientRuler.strength + 2);
  });
});
