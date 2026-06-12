import { elsaConcernedSister, kristoffIcyExplorer } from "@tcg/lorcana-cards/cards/011";
import { peteBadGuy } from "@tcg/lorcana-cards/cards/002";
import { donaldDuckStruttingHisStuff, grammaTalaStoryteller } from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "../../fixture-factory.js";
import { annaIceBreaker } from "@tcg/lorcana-cards/cards/007";
import { olafCarrotEnthusiast } from "@tcg/lorcana-cards/cards/004";

export const bug43KristoffIcyExplorerFixture = createFixture({
  id: "bug-43-kristoff-icy-explorer",
  name: "Bug 43 - Kristoff Icy Explorer wrong-trigger prompt (no Anna)",
  description:
    "Kristoff - Icy Explorer in hand with sufficient ink to play. No Anna character is in play, so the related conditional trigger should not prompt on entry.",
  playerOne: {
    hand: [kristoffIcyExplorer],
    inkwell: 5,
    deck: [donaldDuckStruttingHisStuff, grammaTalaStoryteller],
    play: [annaIceBreaker],
  },
  playerTwo: {
    play: [peteBadGuy],
    inkwell: 3,
    deck: [donaldDuckStruttingHisStuff],
    discard: [elsaConcernedSister, olafCarrotEnthusiast],
  },
  seed: "bug-43-kristoff-icy-explorer",
  skipPreGame: true,
});
