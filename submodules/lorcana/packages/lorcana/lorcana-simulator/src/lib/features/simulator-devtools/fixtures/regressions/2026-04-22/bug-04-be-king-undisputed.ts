import { beKingUndisputed } from "@tcg/lorcana-cards/cards/004";
import { peteBadGuy } from "@tcg/lorcana-cards/cards/002";
import {
  chiefTuiRespectedLeader,
  heiheiBoatSnack,
  donaldDuckStruttingHisStuff,
  partOfYourWorld,
} from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "../../fixture-factory.js";

export const bug04BeKingUndisputed = createFixture({
  id: "bug-04-be-king-undisputed",
  name: "Bug 04 - Be King Undisputed",
  description:
    "Be King Undisputed action in hand with enough ink. Opponent has multiple characters so they must choose one to banish when the song resolves.",
  playerOne: {
    hand: [beKingUndisputed],
    inkwell: 4,
    deck: [heiheiBoatSnack],
  },
  playerTwo: {
    play: [peteBadGuy, chiefTuiRespectedLeader],
    hand: [donaldDuckStruttingHisStuff, partOfYourWorld],
    deck: 10,
  },
  seed: "bug-04-be-king-undisputed",
  skipPreGame: true,
});
