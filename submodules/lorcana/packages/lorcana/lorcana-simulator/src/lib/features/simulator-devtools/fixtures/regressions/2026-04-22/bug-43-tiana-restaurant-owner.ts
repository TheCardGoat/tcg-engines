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
    play: [princeEricNobleSwordsman, daleExcitedFriend],
    inkwell: 4,
    deck: [donaldDuckStruttingHisStuff, grammaTalaStoryteller],
    hand: [grammaTalaStoryteller],
  },
  playerTwo: {
    play: [
      { card: tianaRestaurantOwner, exerted: true },
      { card: montereyJackWatchfulRanger, exerted: true },
      { card: agustinMadrigalExceptionallyKind, exerted: true },
    ],
    inkwell: 3,
    deck: [donaldDuckStruttingHisStuff],
  },
  seed: "bug-43-tiana-restaurant-owner",
  skipPreGame: true,
});
