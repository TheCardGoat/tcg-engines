import type { CharacterCard } from "@tcg/lorcana-types";

export const sneezyVeryAllergic: CharacterCard = {
  id: "1g9",
  cardType: "character",
  name: "Sneezy",
  version: "Very Allergic",
  fullName: "Sneezy - Very Allergic",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "002",
  text: "AH-CHOO! Whenever you play this character or another Seven Dwarfs character, you may give chosen character -1 {S} this turn.",
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  cardNumber: 22,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "bc68ee273fd86bf9eaf9575f86821dccc6a53e16",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Seven Dwarfs"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
// import { wheneverPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const sneezyVeryAllergic: LorcanitoCharacterCard = {
//   id: "aux",
//   name: "Sneezy",
//   title: "Very Allergic",
//   characteristics: ["storyborn", "ally", "seven dwarfs"],
//   text: "**AH-CHOO!** Whenever you play this character or another Seven Dwarfs character, you may give chosen character -1 {S} this turn.",
//   type: "character",
//   abilities: [
//     wheneverPlays({
//       name: "AH-CHOO!",
//       text: "Whenever you play this character or another Seven Dwarfs character, you may give chosen character -1 {S} this turn.",
//       optional: true,
//       triggerTarget: {
//         type: "card",
//         value: 1,
//         filters: [
//           { filter: "type", value: "character" },
//           { filter: "owner", value: "self" },
//           {
//             filter: "characteristics",
//             value: ["seven dwarfs"],
//           },
//         ],
//       },
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 1,
//           modifier: "subtract",
//           target: chosenCharacter,
//         },
//       ],
//     }),
//   ],
//   flavour: "Look out! He's gonna blow!",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 2,
//   strength: 1,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Kendall Hale",
//   number: 22,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 526375,
//   },
//   rarity: "common",
// };
//
