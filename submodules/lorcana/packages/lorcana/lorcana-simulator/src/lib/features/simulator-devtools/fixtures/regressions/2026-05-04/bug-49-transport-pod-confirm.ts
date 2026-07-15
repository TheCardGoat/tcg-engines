import { transportPod } from "@tcg/lorcana-cards/cards/006";
import { andysRoomHomeBase } from "@tcg/lorcana-cards/cards/012";
import { mickeyMouseTrueFriend } from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "../../fixture-factory.js";

export const bug49TransportPodConfirm = createFixture({
  id: "bug-49-transport-pod-confirm",
  name: "Bug 49 - Transport Pod confirm button",
  description:
    "Transport Pod (item) reads: GIVE 'EM A SHOW - At the start of your turn, you may move a character of yours to a location for free. P1 has Transport Pod, Mickey Mouse - True Friend (character to move), and Andy's Room - Home Base (destination location) all in play. Repro steps: (1) at the start of P1's next turn the optional GIVE 'EM A SHOW triggers; (2) accept the optional; (3) select Mickey Mouse as the character to move; (4) select Andy's Room as the destination. Bug: even after both selections are made, the confirm button stays disabled, so the move never executes. Correct behavior: confirm button enables once both a character and a location are selected, and accepting it moves Mickey to Andy's Room for free.",
  playerOne: {
    play: [
      transportPod,
      { card: mickeyMouseTrueFriend, isDrying: false },
      { card: andysRoomHomeBase },
    ],
    hand: [],
    inkwell: 5,
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    play: [],
    deck: 10,
    lore: 0,
  },
  seed: "bug-49-transport-pod-confirm",
  skipPreGame: true,
});
