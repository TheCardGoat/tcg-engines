/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { drCalicoGreeneyedMan } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";

describe("Dr. Calico - Green-Eyed Man", () => {
  it.skip("YOU'RE BEGINNING TO IRK ME While this character has no damage, he gains Resist +2. (Damage dealt to them is reduced by 2.)", async () => {
    const testEngine = new TestEngine({
      inkwell: drCalicoGreeneyedMan.cost,
      play: [drCalicoGreeneyedMan],
      hand: [drCalicoGreeneyedMan],
    });

    await testEngine.playCard(drCalicoGreeneyedMan);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
