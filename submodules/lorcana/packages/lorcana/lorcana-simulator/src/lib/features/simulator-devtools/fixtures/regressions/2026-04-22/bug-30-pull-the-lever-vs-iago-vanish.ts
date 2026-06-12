import { pullTheLever } from "@tcg/lorcana-cards/cards/008";
import { iagoGiantSpectralParrot } from "@tcg/lorcana-cards/cards/007";
import { donaldDuckStruttingHisStuff, heiheiBoatSnack } from "@tcg/lorcana-cards/cards/001";
import { peteBadGuy } from "@tcg/lorcana-cards/cards/002";
import { createFixture } from "../../fixture-factory.js";

export const bug30PullTheLeverVsIagoVanish = createFixture({
  id: "bug-30-pull-the-lever-vs-iago-vanish",
  name: "Bug 30 – Pull the Lever vs Iago (Vanish)",
  description:
    "Opponent controls Iago – Giant Spectral Parrot (Vanish) while the active player has Pull the Lever in hand; verify Vanish interaction when Pull the Lever targets the Vanish character.",
  playerOne: {
    hand: [pullTheLever, donaldDuckStruttingHisStuff],
    inkwell: 6,
    deck: [heiheiBoatSnack, peteBadGuy, donaldDuckStruttingHisStuff],
  },
  playerTwo: {
    hand: [peteBadGuy],
    play: [iagoGiantSpectralParrot],
    inkwell: 4,
    deck: [heiheiBoatSnack, donaldDuckStruttingHisStuff],
  },
  seed: "bug-30-pull-the-lever-vs-iago-vanish",
  skipPreGame: true,
});
