import { herculesSpectralDemigod } from "@tcg/lorcana-cards/cards/011";
import { peteBadGuy } from "@tcg/lorcana-cards/cards/002";
import { heiheiBoatSnack } from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "../../fixture-factory.js";

export const bug08HerculesSpectralDemigod = createFixture({
  id: "bug-08-hercules-spectral-demigod",
  name: "Bug 08 - Hercules Spectral Demigod (1-cost)",
  description:
    "Hercules - Spectral Demigod (1 cost) ready in play. QA can use Boost 2 by putting a card under him at play time (extra inkwell provided), then challenge an opposing exerted character to validate the strength bonus.",
  playerOne: {
    play: [{ card: herculesSpectralDemigod, exerted: false }],
    hand: [heiheiBoatSnack, heiheiBoatSnack],
    inkwell: 3,
    deck: 10,
  },
  playerTwo: {
    play: [{ card: peteBadGuy, exerted: true }],
    deck: 10,
  },
  seed: "bug-08-hercules-spectral-demigod",
  skipPreGame: true,
});
