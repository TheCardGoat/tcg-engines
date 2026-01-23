import type { CharacterCard } from "@tcg/lorcana-types";

export const peteGamesReferee: CharacterCard = {
  id: "1bd",
  cardType: "character",
  name: "Pete",
  version: "Games Referee",
  fullName: "Pete - Games Referee",
  inkType: ["steel"],
  set: "005",
  text: "BLOW THE WHISTLE When you play this character, opponents can't play actions until the start of your next turn.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 195,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "aab48ef177d56da2e65eea439a8141af1e998b77",
  },
  abilities: [],
  classifications: ["Dreamborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   opponentCantPlayActions,
//   untilTheEndOfYourNextTurn,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const peteGamesReferee: LorcanitoCharacterCard = {
//   id: "kxp",
//   name: "Pete",
//   title: "Games Referee",
//   characteristics: ["dreamborn", "villain"],
//   text: "**BLOW THE WHISTLE** When you play this character, opponents can’t play actions until the start of your next turn.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Blow The Whistle",
//       text: "When you play this character, opponents can’t play actions until the start of your next turn.",
//       effects: [untilTheEndOfYourNextTurn(opponentCantPlayActions)],
//     },
//   ],
//   flavour: "It ain't cheatin' if you're the one makin' the rules.",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 3,
//   strength: 3,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Luis Huerta",
//   number: 195,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561975,
//   },
//   rarity: "uncommon",
// };
//
