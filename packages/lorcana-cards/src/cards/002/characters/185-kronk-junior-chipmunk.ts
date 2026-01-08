import type { CharacterCard } from "@tcg/lorcana-types";

export const kronkJuniorChipmunk: CharacterCard = {
  id: "6z5",
  cardType: "character",
  name: "Kronk",
  version: "Junior Chipmunk",
  fullName: "Kronk - Junior Chipmunk",
  inkType: ["steel"],
  franchise: "Emperors New Groove",
  set: "002",
  text: "Resist +1 (Damage dealt to this character is reduced by 1.)\nSCOUT LEADER During your turn, whenever this character banishes another character in a challenge, you may deal 2 damage to chosen character.",
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 2,
  cardNumber: 185,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1924f5a75ed46675b141cc31b8b1730cc15ddc6c",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import {
//   duringYourTurnWheneverBanishesCharacterInChallenge,
//   resistAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const kronkJuniorChipmunk: LorcanitoCharacterCard = {
//   id: "hv3",
//
//   name: "Kronk",
//   title: "Junior Chipmunk",
//   characteristics: ["storyborn", "ally"],
//   text: "**Resist** +1 _(Damage dealt to this character is reduced by 2.)_\n\n**SCOUT LEADER** During your turn, whenever this character banishes another character in a challenge, you may deal 2 damage to chosen character.",
//   type: "character",
//   abilities: [
//     resistAbility(1),
//     // Same as TinkerBell's ability
//     duringYourTurnWheneverBanishesCharacterInChallenge({
//       name: "Scout Leader",
//       text: "During your turn, whenever this character banishes another character in a challenge, you may deal 2 damage to chosen character",
//       optional: true,
//       effects: [
//         {
//           type: "damage",
//           amount: 2,
//           target: chosenCharacter,
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 6,
//   strength: 4,
//   willpower: 5,
//   lore: 2,
//   illustrator: "Brian Weisz",
//   number: 185,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527775,
//   },
//   rarity: "rare",
// };
//
