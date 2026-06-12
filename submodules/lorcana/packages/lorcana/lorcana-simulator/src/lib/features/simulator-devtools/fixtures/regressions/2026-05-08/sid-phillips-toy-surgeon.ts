import { arielOnHumanLegs, simbaProtectiveCub } from "@tcg/lorcana-cards/cards/001";
import {
  rexProtectiveDinosaur,
  sidPhillipsToySurgeon,
  woodyWaitingForAFriend,
} from "@tcg/lorcana-cards/cards/012";
import { createFixture } from "../../fixture-factory.js";

export const sidPhillipsToySurgeonRegression = createFixture({
  id: "sid-phillips-toy-surgeon",
  name: "Sid Phillips - Toy Surgeon — PLAYTIME'S OVER + DOUBLE PRIZES!",
  description:
    "Validate Sid's two abilities. PLAYTIME'S OVER: when you play Sid, optionally banish another chosen character of yours; if you do, each opponent banishes one of theirs. BUG-15 regression: opponent's continuation must restrict to their own characters. DOUBLE PRIZES!: banishing the Toy ally Woody during your turn awards +2 lore.",
  skipPreGame: true,
  seed: "sid-phillips-toy-surgeon",
  playerOne: {
    inkwell: sidPhillipsToySurgeon.cost * 3,
    hand: [sidPhillipsToySurgeon, sidPhillipsToySurgeon, sidPhillipsToySurgeon],
    play: [
      { card: woodyWaitingForAFriend, isDrying: false },
      { card: rexProtectiveDinosaur, isDrying: false },
    ],
    deck: 5,
  },
  playerTwo: {
    inkwell: sidPhillipsToySurgeon.cost * 2,
    hand: [sidPhillipsToySurgeon, sidPhillipsToySurgeon],
    play: [
      { card: simbaProtectiveCub, isDrying: false },
      { card: arielOnHumanLegs, isDrying: false },
    ],
    deck: 5,
  },
});
