import { basilDisguisedDetective } from "@tcg/lorcana-cards/cards/006";
import {
  donaldDuckStruttingHisStuff,
  heiheiBoatSnack,
  partOfYourWorld,
  ransack,
} from "@tcg/lorcana-cards/cards/001";
import { peteBadGuy } from "@tcg/lorcana-cards/cards/002";
import { createFixture } from "../../fixture-factory.js";

export const bug27BasilDisguisedDetective = createFixture({
  id: "bug-27-basil-disguised-detective",
  name: "Bug 27 – Basil, Disguised Detective",
  description:
    "Basil – Disguised Detective in play with TWISTS AND TURNS activation ready and ink available; opponent has cards in hand for any triggered selection follow-up.",
  playerOne: {
    hand: [partOfYourWorld, donaldDuckStruttingHisStuff],
    play: [basilDisguisedDetective],
    inkwell: 6,
    deck: [heiheiBoatSnack, peteBadGuy, donaldDuckStruttingHisStuff],
  },
  playerTwo: {
    hand: [donaldDuckStruttingHisStuff, heiheiBoatSnack, peteBadGuy, ransack],
    inkwell: 4,
    deck: [heiheiBoatSnack, donaldDuckStruttingHisStuff],
  },
  seed: "bug-27-basil-disguised-detective",
  skipPreGame: true,
});
