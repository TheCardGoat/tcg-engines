import { heiheiBoatSnack } from "@tcg/lorcana-cards/cards/001";
import { launchpadTrustySidekick, mickeyMouseSnowboardAce } from "@tcg/lorcana-cards/cards/011";
import { createFixture } from "../fixture-factory.js";

export const mickeySurvivesChallengeRegression = createFixture({
  id: "mickey-survives-challenge",
  name: "Mickey survives a challenge",
  description:
    "Mickey banishes Launchpad and survives. Slippery Slope must not make the opponent discard.",
  skipPreGame: true,
  seed: "mickey-survives-challenge",
  playerOne: { play: [{ card: mickeyMouseSnowboardAce, isDrying: false }], deck: 10 },
  playerTwo: {
    play: [{ card: launchpadTrustySidekick, exerted: true }],
    hand: [heiheiBoatSnack, heiheiBoatSnack],
    deck: 10,
  },
});
