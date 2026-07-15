import { donaldDuckFlusteredSorcerer } from "@tcg/lorcana-cards/cards/007";
import { peteBadGuy } from "@tcg/lorcana-cards/cards/002";
import {
  donaldDuckStruttingHisStuff,
  grammaTalaStoryteller,
  chiefTuiRespectedLeader,
} from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "../../fixture-factory.js";

export const bug41DonaldFlusteredLoreWinFixture = createFixture({
  id: "bug-41-donald-flustered-lore-win",
  name: "Bug 41 - Donald Duck Flustered Sorcerer lore-win check",
  description:
    "Donald Duck - Flustered Sorcerer in play with the opponent at 18 lore. Used to verify the lore-win check fires mid-turn when lore crosses 20.",
  playerOne: {
    inkwell: 3,
    deck: [donaldDuckStruttingHisStuff],
    lore: 18,
    play: [peteBadGuy],
  },
  playerTwo: {
    play: [donaldDuckFlusteredSorcerer, chiefTuiRespectedLeader],
    inkwell: 6,
    deck: [donaldDuckStruttingHisStuff, grammaTalaStoryteller],
    hand: [grammaTalaStoryteller],
    lore: 18,
  },
  seed: "bug-41-donald-flustered-lore-win",
  skipPreGame: true,
});
