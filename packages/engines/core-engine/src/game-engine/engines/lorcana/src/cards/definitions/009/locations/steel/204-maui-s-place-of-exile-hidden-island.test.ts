import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { mauisPlaceOfExileHiddenIsland } from "./204-maui-s-place-of-exile-hidden-island";

describe("Maui's Place of Exile - Hidden Island", () => {
  it.skip("**ISOLATED** Characters gain **Resist** +1 while here. _(Damage dealt to them is reduced by 1.)_", async () => {
    const testEngine = new TestEngine({
      inkwell: mauisPlaceOfExileHiddenIsland.cost,
      play: [mauisPlaceOfExileHiddenIsland],
      hand: [mauisPlaceOfExileHiddenIsland],
    });

    await testEngine.playCard(mauisPlaceOfExileHiddenIsland);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
