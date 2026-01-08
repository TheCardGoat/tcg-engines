import type { CharacterCard } from "@tcg/lorcana-types";

export const kenaiProtectiveBrother: CharacterCard = {
  id: "eiu",
  cardType: "character",
  name: "Kenai",
  version: "Protective Brother",
  fullName: "Kenai - Protective Brother",
  inkType: ["amber"],
  franchise: "Brother Bear",
  set: "007",
  text: "HE NEEDS ME At the end of your turn, if this character is exerted, you may ready another chosen character of yours and remove all damage from them.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 30,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "345850a0e7457dea4d8b46cc4b73e6cc0285b496",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { atTheEndOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
// import { anotherChosenCharacterOfYours } from "@lorcanito/lorcana-engine/abilities/targets";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const kenaiProtectiveBrother: LorcanitoCharacterCard = {
//   id: "kr8",
//   name: "Kenai",
//   title: "Protective Brother",
//   characteristics: ["storyborn", "hero"],
//   text: "HE NEEDS ME At the end of your turn, if this character is exerted, you may ready another chosen character of yours and remove all damage from them.",
//   type: "character",
//   abilities: [
//     atTheEndOfYourTurn({
//       name: "HE NEEDS ME",
//       text: "At the end of your turn, if this character is exerted, you may ready another chosen character of yours and remove all damage from them.",
//       conditions: [{ type: "exerted" }],
//       optional: true,
//       effects: [
//         {
//           type: "exert",
//           exert: false,
//           target: anotherChosenCharacterOfYours,
//         },
//         {
//           type: "heal",
//           amount: 99,
//           target: {
//             type: "card",
//             value: "all",
//             filters: [{ filter: "source", value: "target" }],
//           },
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 4,
//   strength: 2,
//   willpower: 4,
//   illustrator: "Julien Yavorskis",
//   number: 30,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619423,
//   },
//   rarity: "rare",
//   lore: 1,
// };
//
