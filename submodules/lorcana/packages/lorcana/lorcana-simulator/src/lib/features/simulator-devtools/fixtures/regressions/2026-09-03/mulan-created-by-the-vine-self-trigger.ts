import { medallionWeights } from "@tcg/lorcana-cards/cards/009";
import { mulanCreatedByTheVine } from "@tcg/lorcana-cards/cards/013";
import { createFixture } from "../../fixture-factory.js";

export const mulanCreatedByTheVineSelfTriggerRegression = createFixture({
  id: "mulan-created-by-the-vine-self-trigger",
  name: "Mulan - Created by the Vine self trigger",
  description:
    "Player report regression: playing Mulan herself must offer DEMOLISH and allow her controller to banish an opposing Medallion Weights.",
  skipPreGame: true,
  seed: "mulan-created-by-the-vine-self-trigger",
  playerOne: {
    hand: [mulanCreatedByTheVine],
    inkwell: mulanCreatedByTheVine.cost,
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    play: [medallionWeights],
    deck: 10,
    lore: 0,
  },
});
