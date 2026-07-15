import { heiheiBoatSnack } from "@tcg/lorcana-cards/cards/001";
import { peteBadGuy } from "@tcg/lorcana-cards/cards/002";
import { theyNeverComeBack } from "@tcg/lorcana-cards/cards/008";
import { auroraDreamingGuardian } from "@tcg/lorcana-cards/cards/009";
import { createFixture } from "../../fixture-factory.js";

export const bug17AuroraDreamingGuardian = createFixture({
  id: "bug-17-aurora-dreaming-guardian",
  name: "Bug 17 - Aurora, Dreaming Guardian",
  description:
    "NOT FIXED. Aurora grants Ward to a friendly Hero. Opponent holds 'They Never Come Back' to attempt bypass of Ward. QA should play the opposing action and verify intended protection behavior.",
  playerOne: {
    play: [auroraDreamingGuardian, heiheiBoatSnack],
    hand: [heiheiBoatSnack],
    inkwell: 5,
    deck: [heiheiBoatSnack, heiheiBoatSnack, heiheiBoatSnack],
  },
  playerTwo: {
    hand: [theyNeverComeBack, peteBadGuy],
    inkwell: 6,
    deck: [peteBadGuy, peteBadGuy, peteBadGuy],
  },
  seed: "bug-17-aurora-dreaming-guardian",
  skipPreGame: true,
});
