import { belleAccomplishedMystic } from "@tcg/lorcana-cards/cards/004";
import {
  chiefTuiRespectedLeader,
  donaldDuckStruttingHisStuff,
  grammaTalaStoryteller,
} from "@tcg/lorcana-cards/cards/001";
import { peteBadGuy } from "@tcg/lorcana-cards/cards/002";
import { createFixture } from "../../fixture-factory.js";

export const bug36BelleAccomplishedMysticFixture = createFixture({
  id: "bug-36-belle-accomplished-mystic",
  name: "Bug 36 - Belle Accomplished Mystic damage move",
  description:
    "Belle - Accomplished Mystic in play alongside a pre-damaged friendly character so the ACCOMPLISHED MYSTIC trigger has a valid source/destination for moving damage.",
  playerOne: {
    play: [{ card: chiefTuiRespectedLeader, damage: 2 }, donaldDuckStruttingHisStuff],
    inkwell: 5,
    deck: [grammaTalaStoryteller, donaldDuckStruttingHisStuff],
    hand: [grammaTalaStoryteller, belleAccomplishedMystic],
  },
  playerTwo: {
    // Pete and donal have ward and shouldn't be able to be targeted.
    play: [peteBadGuy, donaldDuckStruttingHisStuff, chiefTuiRespectedLeader],
    inkwell: 3,
  },
  seed: "bug-36-belle-accomplished-mystic",
  skipPreGame: true,
});
