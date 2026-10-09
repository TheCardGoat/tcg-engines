import { heiheiBoatSnack } from "@tcg/lorcana-cards/cards/001";
import { retroEvolutionDevice } from "@tcg/lorcana-cards/cards/011";
import { alienTrueBeliever } from "@tcg/lorcana-cards/cards/012";
import { createFixture } from "../fixture-factory.js";

export const alienRetroEvolutionDeviceRegression = createFixture({
  id: "alien-retro-evolution-device",
  name: "Alien returns another Alien after Retro Evolution Device",
  description:
    "Banish Alien with Retro Evolution Device, play Heihei, then return the other Alien from discard. The banished source must stay in discard.",
  skipPreGame: true,
  seed: "alien-retro-evolution-device",
  playerOne: {
    play: [alienTrueBeliever, retroEvolutionDevice],
    discard: [alienTrueBeliever],
    hand: [heiheiBoatSnack],
    inkwell: 1,
    deck: 10,
  },
  playerTwo: { deck: 10 },
});
