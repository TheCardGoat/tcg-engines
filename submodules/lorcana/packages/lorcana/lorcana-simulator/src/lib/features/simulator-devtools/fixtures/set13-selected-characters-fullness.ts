import {
  archimedesHighlyEducatedOwl,
  liloMakingAWish,
  mickeyMouseTrueFriend,
  simbaProtectiveCub,
} from "@tcg/lorcana-cards/cards/001";
import { chipFriendIndeed } from "@tcg/lorcana-cards/cards/006";
import { angelExperiment624 } from "@tcg/lorcana-cards/cards/011";
import {
  andysRoomHomeBase,
  hammPiggyBank,
  lordMacguffinCleverSwordsman,
  rollerBobSidsToy,
  windupFrogSidsToy,
} from "@tcg/lorcana-cards/cards/012";
import {
  booEnergeticChild,
  carlFredricksenOnTheMove,
  carlsHouseFlyingHigh,
  lookWhatYouveDone,
  maleficentDiabloEvilIncarnate,
  maleficentExultantSpellcaster,
  meridaWispConjurer,
  motherGothelEvilAsEver,
  paradiseFallsExoticDestination,
  rapunzelEscapingTheTower,
  sulleyBooScareBuddies,
  sulleyProtectiveMonster,
  sulleyTheNewBoss,
  theHornedKingMercilessMaster,
  woodyHelpingAFriend,
} from "@tcg/lorcana-cards/cards/013";
import { createFixture } from "./fixture-factory.js";

const drawDeck = [
  mickeyMouseTrueFriend,
  simbaProtectiveCub,
  archimedesHighlyEducatedOwl,
  liloMakingAWish,
  chipFriendIndeed,
  angelExperiment624,
  sulleyProtectiveMonster,
  rollerBobSidsToy,
  windupFrogSidsToy,
  hammPiggyBank,
];

const discardCharacters = [
  archimedesHighlyEducatedOwl,
  liloMakingAWish,
  chipFriendIndeed,
  angelExperiment624,
  sulleyProtectiveMonster,
  rollerBobSidsToy,
  windupFrogSidsToy,
];

export const set13SelectedCharactersFullnessFixture = createFixture({
  id: "set13-selected-characters-fullness",
  name: "Set 13 Selected Characters - Fullness Setup",
  description:
    "Targeted visual setup for Carl Fredricksen - On the Move, Mother Gothel - Evil as Ever, Maleficent & Diablo - Evil Incarnate, Merida - Wisp Conjurer, The Horned King - Merciless Master, Sulley & Boo - Scare Buddies, and Woody - Helping a Friend. Play Paradise Falls to trigger Carl, activate Rapunzel to discard and replay Mother Gothel, free-shift Maleficent & Diablo from hand, play Lord MacGuffin exerted to trigger Merida, play discard characters with the exerted Horned King, banish the damaged Sulley & Boo with Look What You've Done, and play Woody with another Toy in play to choose both HANG ON! modes.",
  seed: "set13-selected-characters-fullness",
  skipPreGame: true,
  playerOne: {
    inkwell: 40,
    lore: 5,
    hand: [
      sulleyBooScareBuddies,
      paradiseFallsExoticDestination,
      motherGothelEvilAsEver,
      maleficentDiabloEvilIncarnate,
      lordMacguffinCleverSwordsman,
      meridaWispConjurer,
      woodyHelpingAFriend,
      liloMakingAWish,
      lookWhatYouveDone,
    ],
    play: [
      booEnergeticChild,
      { card: carlFredricksenOnTheMove, isDrying: false },
      { card: rapunzelEscapingTheTower, isDrying: false },
      { card: meridaWispConjurer, isDrying: false },
      { card: theHornedKingMercilessMaster, isDrying: false, exerted: true },
      { card: hammPiggyBank, isDrying: false },
      { card: maleficentExultantSpellcaster, isDrying: false },
      {
        card: sulleyBooScareBuddies,
        isDrying: false,
        damage: 4,
        cardsUnder: [
          { card: sulleyTheNewBoss, publicFaceState: "faceUp" as const },
          { card: booEnergeticChild, publicFaceState: "faceUp" as const },
        ],
      },
      carlsHouseFlyingHigh,
      andysRoomHomeBase,
    ],
    discard: discardCharacters,
    deck: drawDeck,
  },
  playerTwo: {
    inkwell: 20,
    lore: 5,
    hand: [],
    play: [
      { card: mickeyMouseTrueFriend, isDrying: false, exerted: true, damage: 1 },
      { card: simbaProtectiveCub, isDrying: false, exerted: true, damage: 1 },
      { card: angelExperiment624, isDrying: false, exerted: true },
    ],
    discard: [mickeyMouseTrueFriend, simbaProtectiveCub],
    deck: [...drawDeck].reverse(),
  },
});
