import { heiheiBoatSnack } from "@tcg/lorcana-cards/cards/001";
import { peteBadGuy } from "@tcg/lorcana-cards/cards/002";
import { anastasiaBossyStepsister } from "@tcg/lorcana-cards/cards/007";
import { createFixture } from "../../fixture-factory.js";

export const bug16AnastasiaBossyStepsister = createFixture({
  id: "bug-16-anastasia-bossy-stepsister",
  name: "Bug 16 - Anastasia, Bossy Stepsister",
  description:
    "Anastasia in play (ready) defending while an opposing character is ready to challenge her. Toggle Anastasia between ready/exerted in devtools as needed to reproduce the challenge interaction.",
  playerOne: {
    play: [{ card: anastasiaBossyStepsister, exerted: true }, heiheiBoatSnack],
    hand: [heiheiBoatSnack],
    inkwell: 4,
    deck: [heiheiBoatSnack, heiheiBoatSnack],
  },
  playerTwo: {
    play: [peteBadGuy, { card: anastasiaBossyStepsister, exerted: true }],
    inkwell: 4,
    hand: [heiheiBoatSnack],
    deck: [peteBadGuy, peteBadGuy, peteBadGuy],
  },
  seed: "bug-16-anastasia-bossy-stepsister",
  skipPreGame: true,
});
