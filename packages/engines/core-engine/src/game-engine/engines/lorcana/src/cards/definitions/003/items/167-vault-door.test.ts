import { describe, expect, it } from "bun:test";
import { baBoom } from "~/game-engine/engines/lorcana/src/cards/definitions/003/actions";
import { scroogeMcduckUncleMoneybags } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters";
import { vaultDoor } from "~/game-engine/engines/lorcana/src/cards/definitions/003/items/index";
import { mcduckManorScroogesMansion } from "~/game-engine/engines/lorcana/src/cards/definitions/003/locations";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Vault Door", () => {
  it("Your locations gain **Resist** +1", async () => {
    const testEngine = new TestEngine({
      inkwell: baBoom.cost,
      play: [
        vaultDoor,
        mcduckManorScroogesMansion,
        scroogeMcduckUncleMoneybags,
      ],
      hand: [baBoom],
    });

    const location = testEngine.getCardModel(mcduckManorScroogesMansion);
    const damageAction = testEngine.getCardModel(baBoom);

    damageAction.playFromHand();
    await testEngine.resolveTopOfStack({ targets: [location] });

    expect(location.damage).toBe(1);
  });
  it("Your characters at locations gain **Resist** +1", async () => {
    const testEngine = new TestEngine({
      inkwell: baBoom.cost + mcduckManorScroogesMansion.moveCost,
      play: [
        vaultDoor,
        mcduckManorScroogesMansion,
        scroogeMcduckUncleMoneybags,
      ],
      hand: [baBoom],
    });

    const location = testEngine.getCardModel(mcduckManorScroogesMansion);
    const character = testEngine.getCardModel(scroogeMcduckUncleMoneybags);
    const damageAction = testEngine.getCardModel(baBoom);

    await testEngine.moveToLocation({ location, character });

    damageAction.playFromHand();
    await testEngine.resolveTopOfStack({ targets: [character] });

    expect(character.damage).toBe(1);
  });

  it("Your characters outside locations DONT gain **Resist** +1", async () => {
    const testEngine = new TestEngine({
      inkwell: baBoom.cost,
      play: [
        vaultDoor,
        mcduckManorScroogesMansion,
        scroogeMcduckUncleMoneybags,
      ],
      hand: [baBoom],
    });

    const character = testEngine.getCardModel(scroogeMcduckUncleMoneybags);
    const damageAction = testEngine.getCardModel(baBoom);

    damageAction.playFromHand();
    await testEngine.resolveTopOfStack({ targets: [character] });

    expect(character.damage).toBe(2);
  });
});
