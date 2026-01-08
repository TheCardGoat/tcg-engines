import type { CharacterCard } from "@tcg/lorcana-types";

export const mrsJudsonHousekeeper: CharacterCard = {
  id: "1j5",
  cardType: "character",
  name: "Mrs. Judson",
  version: "Housekeeper",
  fullName: "Mrs. Judson - Housekeeper",
  inkType: ["sapphire"],
  franchise: "Great Mouse Detective",
  set: "002",
  text: "TIDY UP Whenever you play a Floodborn character, you may put the top card of your deck into your inkwell facedown and exerted.",
  cost: 4,
  strength: 1,
  willpower: 5,
  lore: 2,
  cardNumber: 153,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c67499192d6e09bc15e8dac69e0648f8948501b8",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { wheneverYouPlayAFloodBorn } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const mrsJudsonHousekeeper: LorcanitoCharacterCard = {
//   id: "rqb",
//
//   name: "Mrs. Judson",
//   title: "Housekeeper",
//   characteristics: ["storyborn", "ally"],
//   text: "**TIDY UP** Whenever you play a Floodborn character, you may put the top card of your deck into your inkwell facedown and exerted.",
//   type: "character",
//   abilities: [
//     wheneverYouPlayAFloodBorn({
//       name: "Tidy Up",
//       text: "Whenever you play a Floodborn character, you may put the top card of your deck into your inkwell facedown and exerted.",
//       optional: true,
//       effects: [
//         {
//           type: "move",
//           to: "inkwell",
//           exerted: true,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [{ filter: "top-deck", value: "self" }],
//           },
//         },
//       ],
//     }),
//   ],
//   flavour:
//     '"I know just the thing. Let me fetch you a pot of tea and some of my fresh cheese crumpets."',
//   colors: ["sapphire"],
//   cost: 4,
//   strength: 1,
//   willpower: 5,
//   lore: 2,
//   illustrator: "Michaela Martin",
//   number: 153,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 525268,
//   },
//   rarity: "rare",
// };
//
