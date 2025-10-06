/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  berliozMischievousKitten,
  drizellaSpoiledStepsister,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  daleBumbler,
  napoleonCleverBloodhound,
  queenOfHeartsHaughtyMonarch,
  tipoJuniorChipmunk,
  wilhelminaPackardRadioOperator,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Queen Of Hearts - Haughty Monarch", () => {
  it("COUNT OFF! While there are 5 or more characters with damage in play, this character gets +3 {L}.", async () => {
    const testEngine = new TestEngine(
      {
        play: [
          queenOfHeartsHaughtyMonarch,
          tipoJuniorChipmunk,
          wilhelminaPackardRadioOperator,
          daleBumbler,
          drizellaSpoiledStepsister,
        ],
      },
      {
        play: [napoleonCleverBloodhound, berliozMischievousKitten],
      },
    );

    const cardUnderTest = testEngine.getCardModel(queenOfHeartsHaughtyMonarch);

    await testEngine.setCardDamage(tipoJuniorChipmunk, 1);
    await testEngine.setCardDamage(daleBumbler, 1);
    await testEngine.setCardDamage(napoleonCleverBloodhound, 1);
    await testEngine.setCardDamage(drizellaSpoiledStepsister, 1);
    await testEngine.setCardDamage(berliozMischievousKitten, 1);

    expect(cardUnderTest.lore).toEqual(6);
    // await testEngine.resolveOptionalAbility();
    //await testEngine.resolveTopOfStack({});
  });
});
