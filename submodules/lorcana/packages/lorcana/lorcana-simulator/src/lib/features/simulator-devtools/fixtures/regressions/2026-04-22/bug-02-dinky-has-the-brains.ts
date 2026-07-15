import { dinkyHasTheBrains } from "@tcg/lorcana-cards/cards/011";
import { peteBadGuy } from "@tcg/lorcana-cards/cards/002";
import { chiefTuiRespectedLeader, heiheiBoatSnack } from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "../../fixture-factory.js";

export const bug02DinkyHasTheBrains = createFixture({
  id: "bug-02-dinky-has-the-brains",
  name: "Bug 02 - Dinky Has the Brains",
  description:
    "Dinky - Has the Brains in hand with ink available. On play, the GET HIM! ability should let the opponent choose one of their own characters and take 1 damage on it.",
  playerOne: {
    hand: [dinkyHasTheBrains],
    inkwell: 2,
    deck: [heiheiBoatSnack],
  },
  playerTwo: {
    play: [peteBadGuy, chiefTuiRespectedLeader],
    deck: 10,
  },
  seed: "bug-02-dinky-has-the-brains",
  skipPreGame: true,
});
