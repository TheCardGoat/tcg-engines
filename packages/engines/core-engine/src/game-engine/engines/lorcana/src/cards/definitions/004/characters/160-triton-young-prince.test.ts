/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  bellesHouseMauricesWorkshop,
  mcduckManorScroogesMansion,
} from "~/game-engine/engines/lorcana/src/cards/definitions/003/locations";
import { tritonYoungPrince } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import { arielsGrottoASecretPlace } from "~/game-engine/engines/lorcana/src/cards/definitions/004/locations";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Triton - Young Prince", () => {
  it("**SUPERIOR SWIMMER** During your turn, this character gains **Evasive**. _(They can challenge characters with Evasive.)_**KEEPER OF ATLANTICA** Whenever one of your locations is banished, you may put that card into your inkwell facedown and exerted.", async () => {
    const testEngine = new TestEngine({
      inkwell: tritonYoungPrince.cost,
      play: [
        tritonYoungPrince,
        arielsGrottoASecretPlace,
        mcduckManorScroogesMansion,
      ],
      discard: [bellesHouseMauricesWorkshop],
    });

    const target = testEngine.getCardModel(arielsGrottoASecretPlace);
    const locInPlay = testEngine.getCardModel(mcduckManorScroogesMansion);
    const locInDiscard = testEngine.getCardModel(bellesHouseMauricesWorkshop);

    target.banish();
    expect(target.zone).toEqual("discard");
    expect(locInPlay.zone).toEqual("play");
    expect(locInDiscard.zone).toEqual("discard");

    await testEngine.resolveOptionalAbility();

    expect(target.zone).toEqual("inkwell");
    expect(locInPlay.zone).toEqual("play");
    expect(locInDiscard.zone).toEqual("discard");
  });
});
