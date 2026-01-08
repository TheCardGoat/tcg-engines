import type { CharacterCard } from "@tcg/lorcana-types";

export const johnSilverShipsCook: CharacterCard = {
  id: "1r7",
  cardType: "character",
  name: "John Silver",
  version: "Ship's Cook",
  fullName: "John Silver - Ship's Cook",
  inkType: ["steel"],
  franchise: "Treasure Planet",
  set: "006",
  text: "HUNK OF HARDWARE When you play this character, chosen character can't challenge during their next turn.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 181,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e42ba1be2038f64d1b9a6bbdc92549f105c446ec",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Alien", "Pirate", "Captain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacterCantChallengeDuringNextTurn } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const johnSilverShipsCook: LorcanitoCharacterCard = {
//   id: "vyq",
//   missingTestCase: true,
//   name: "John Silver",
//   title: "Ship's Cook",
//   characteristics: ["storyborn", "villain", "alien", "pirate", "captain"],
//   text: "HUNK OF HARDWARE When you play this character, chosen character can't challenge during their next turn.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Hunk of Hardware",
//       text: "When you play this character, chosen character can't challenge during their next turn.",
//       effects: [chosenCharacterCantChallengeDuringNextTurn],
//     },
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 3,
//   strength: 3,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Leonardo Giammichele",
//   number: 181,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 587755,
//   },
//   rarity: "common",
// };
//
