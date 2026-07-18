import { tianaRestaurantOwner } from "@tcg/lorcana-cards/cards/006";
import { donaldDuckStruttingHisStuff, grammaTalaStoryteller } from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "../../fixture-factory.js";
import {
  agustinMadrigalExceptionallyKind,
  daleExcitedFriend,
  montereyJackWatchfulRanger,
  princeEricNobleSwordsman,
} from "@tcg/lorcana-cards/cards/012";

export const bug43TianaRestaurantOwnerFixture = createFixture({
  id: "bug-43-tiana-restaurant-owner",
  name: "Bug 43 - Tiana Restaurant Owner wrong-trigger prompt (ready-only)",
  description:
    "Tiana - Restaurant Owner in play with only the ready copy available. Used to verify the trigger does not prompt when the precondition is not met.",
  playerOne: {
    play: [
      { card: princeEricNobleSwordsman, isDrying: false },
      { card: daleExcitedFriend, isDrying: false },
    ],
    inkwell: 4,
    deck: [donaldDuckStruttingHisStuff, grammaTalaStoryteller],
    hand: [grammaTalaStoryteller],
  },
  playerTwo: {
    play: [
      { card: tianaRestaurantOwner, exerted: false, isDrying: false },
      { card: montereyJackWatchfulRanger, exerted: true, isDrying: false },
      { card: agustinMadrigalExceptionallyKind, exerted: true, isDrying: false },
    ],
    inkwell: 3,
    deck: [donaldDuckStruttingHisStuff],
  },
  seed: "bug-43-tiana-restaurant-owner",
  skipPreGame: true,
});
