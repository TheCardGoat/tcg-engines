/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  emeraldCoil,
  kashekimAncientRuler,
  suzyMasterSeamstress,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Emerald Coil", () => {
  it("SHIMMERING WINGS During your turn, whenever a card is put into your inkwell, chosen character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)", async () => {
    const testEngine = new TestEngine(
      {
        deck: 2,
        play: [emeraldCoil, kashekimAncientRuler],
        hand: [suzyMasterSeamstress],
      },
      {
        deck: 2,
      },
    );
    const target = testEngine.getCardModel(kashekimAncientRuler);

    expect(target.hasEvasive).toBe(false);

    await testEngine.putIntoInkwell(suzyMasterSeamstress);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({ targets: [kashekimAncientRuler] });

    expect(target.hasEvasive).toBe(true);

    await testEngine.passTurn();
    expect(target.hasEvasive).toBe(true);

    await testEngine.passTurn();
    expect(target.hasEvasive).toBe(false);
  });
});
