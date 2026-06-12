import {
  friendsOnTheOtherSide,
  mickeyMouseTrueFriend,
  simbaProtectiveCub,
} from "@tcg/lorcana-cards/cards/001";
import { annaDiplomaticQueen } from "@tcg/lorcana-cards/cards/005";
import { unfortunateSituation } from "@tcg/lorcana-cards/cards/006";
import { daisyDuckMultitalentedPirate } from "@tcg/lorcana-cards/cards/007";
import { pullTheLever, jafarHighSultanOfLorcana } from "@tcg/lorcana-cards/cards/008";
import { littleJohnSirReginald } from "@tcg/lorcana-cards/cards/009";
import {
  donaldDuckGhostHunter,
  hadesLookingForADeal,
  mickeyMouseDetective,
} from "@tcg/lorcana-cards/cards/010";
import { doYouWantToBuildASnowman } from "@tcg/lorcana-cards/cards/011";
import { createFixture } from "./fixture-factory";

export const modalAbilitiesFixture = createFixture({
  id: "modal-abilities",
  name: "Modal Abilities",
  description:
    "Manual modal test bed covering controller choose-one branches, opponent-picked targets and discards, and chosen-opponent modal responses.",
  skipPreGame: true,
  playerOne: {
    inkwell: 20,
    hand: [
      pullTheLever,
      littleJohnSirReginald,
      annaDiplomaticQueen,
      unfortunateSituation,
      doYouWantToBuildASnowman,
      mickeyMouseTrueFriend,
      hadesLookingForADeal,
    ],
    play: [
      { card: daisyDuckMultitalentedPirate, isDrying: false },
      { card: simbaProtectiveCub, isDrying: false },
    ],
  },
  playerTwo: {
    hand: [mickeyMouseTrueFriend, simbaProtectiveCub, friendsOnTheOtherSide, mickeyMouseDetective],
    play: [
      { card: jafarHighSultanOfLorcana, damage: 1 },
      { card: donaldDuckGhostHunter, isDrying: false },
      { card: mickeyMouseDetective, isDrying: false },
    ],
  },
});
