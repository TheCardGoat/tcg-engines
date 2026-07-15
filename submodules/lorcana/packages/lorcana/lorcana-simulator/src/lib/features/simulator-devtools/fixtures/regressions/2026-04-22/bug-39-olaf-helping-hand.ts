import { olafHelpingHand } from "@tcg/lorcana-cards/cards/010";
import { peteBadGuy } from "@tcg/lorcana-cards/cards/002";
import { donaldDuckStruttingHisStuff, grammaTalaStoryteller } from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "../../fixture-factory.js";

export const bug39OlafHelpingHandFixture = createFixture({
  id: "bug-39-olaf-helping-hand",
  name: "Bug 39 - Olaf Helping Hand leaves-play trigger",
  description:
    "Olaf - Helping Hand in play with an opposing ready attacker available to challenge and banish him. Used to verify the leaves-play trigger fires exactly once.",
  playerOne: {
    play: [{ card: olafHelpingHand, exerted: true }, grammaTalaStoryteller],
    inkwell: 4,
    deck: [donaldDuckStruttingHisStuff, grammaTalaStoryteller],
  },
  playerTwo: {
    play: [peteBadGuy],
    inkwell: 3,
    deck: [donaldDuckStruttingHisStuff],
  },
  seed: "bug-39-olaf-helping-hand",
  skipPreGame: true,
});
