import { desperatePlan } from "@tcg/lorcana-cards/cards/008";
import { chiefTuiRespectedLeader } from "@tcg/lorcana-cards/cards/001";
import { peteBadGuy } from "@tcg/lorcana-cards/cards/002";
import { heiheiBoatSnack } from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "../../fixture-factory.js";

export const bug66DesperatePlanDiscardStep = createFixture({
  id: "bug-66-desperate-plan-discard-step",
  name: "Bug 66 - Desperate Plan discard chooser",
  description:
    "Replay mgwHPweIY8WbYq9hWAqz2Bc turn 14 visual validation. P1 has Desperate Plan in hand plus 4 other cards in hand to discard from, and 1 ink available. Play Desperate Plan via click-to-play and, where available, drag/drop. Expected: the discard-choice prompt opens instead of resolving as discard zero; confirming zero discards draws zero, confirming one discard draws exactly one, and confirming multiple discards draws the same count.",
  playerOne: {
    play: [],
    hand: [desperatePlan, chiefTuiRespectedLeader, peteBadGuy, heiheiBoatSnack, heiheiBoatSnack],
    inkwell: 1,
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    play: [],
    deck: 10,
    lore: 0,
  },
  seed: "bug-66-desperate-plan-discard-step",
  skipPreGame: true,
});
