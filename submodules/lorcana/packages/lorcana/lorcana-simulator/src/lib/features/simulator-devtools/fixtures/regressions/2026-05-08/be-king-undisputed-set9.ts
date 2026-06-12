import { arielOnHumanLegs, simbaProtectiveCub } from "@tcg/lorcana-cards/cards/001";
import { beKingUndisputed } from "@tcg/lorcana-cards/cards/009";
import { createFixture } from "../../fixture-factory.js";

export const beKingUndisputedSet9 = createFixture({
  id: "be-king-undisputed-set9",
  name: "Be King Undisputed (set 9 reprint) — opponent chooses banish",
  description:
    "P1 plays Be King; P2 must choose one of THEIR OWN characters to banish. P1 has Ariel in play to guard against the controller's ally leaking into the opponent's candidate list.",
  skipPreGame: true,
  seed: "be-king-undisputed-set9",
  playerOne: {
    inkwell: beKingUndisputed.cost * 3,
    hand: [beKingUndisputed, beKingUndisputed, beKingUndisputed],
    play: [{ card: arielOnHumanLegs, isDrying: false }],
    deck: 5,
  },
  playerTwo: {
    inkwell: beKingUndisputed.cost * 2,
    hand: [beKingUndisputed, beKingUndisputed],
    play: [
      { card: simbaProtectiveCub, isDrying: false },
      { card: arielOnHumanLegs, isDrying: false },
    ],
    deck: 5,
  },
});
