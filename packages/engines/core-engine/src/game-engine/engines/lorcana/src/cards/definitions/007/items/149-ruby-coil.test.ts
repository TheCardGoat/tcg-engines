/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  kashekimAncientRuler,
  rubyCoil,
  suzyMasterSeamstress,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";

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
