/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { boltDownButNotOut } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";

describe("Bolt - Down but Not Out", () => {
  it.skip("NONE OF YOUR POWERS ARE WORKING This character enters play exerted.", async () => {
    const testEngine = new TestEngine({
      inkwell: boltDownButNotOut.cost,
      play: [boltDownButNotOut],
      hand: [boltDownButNotOut],
    });

    await testEngine.playCard(boltDownButNotOut);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
