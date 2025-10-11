import { describe, expect, it } from "bun:test";
import {
  liloMakingAWish,
  stichtNewDog,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { pawpsicle } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items";
import { aladdinBraveRescuer } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters";
import { hiroHamadaRoboticsProdigy } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Hiro Hamada - Robotics Prodigy", () => {
  it("**SWEET TECH**  {E}, 2 {I} − Search your deck for an item card or a Robot character card and reveal it to all players. Shuffle your deck and put that card on top of it.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: 2,
        play: [hiroHamadaRoboticsProdigy],
        deck: [liloMakingAWish, stichtNewDog, pawpsicle, aladdinBraveRescuer],
      },
      {
        deck: 1,
      },
    );

    const cardUnderTest = testEngine.getCardModel(hiroHamadaRoboticsProdigy);
    const target = testEngine.getCardModel(pawpsicle);
    await testEngine.activateCard(cardUnderTest, { ability: "SWEET TECH" });

    await testEngine.resolveTopOfStack({ targets: [target] });

    await testEngine.passTurn();
    await testEngine.passTurn();

    expect(target.zone).toEqual("hand");
  });
});
