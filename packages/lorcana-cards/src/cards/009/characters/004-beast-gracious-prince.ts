import type { CharacterCard } from "@tcg/lorcana-types";

export const beastGraciousPrince: CharacterCard = {
  id: "144",
  cardType: "character",
  name: "Beast",
  version: "Gracious Prince",
  fullName: "Beast - Gracious Prince",
  inkType: ["amber"],
  franchise: "Beauty and the Beast",
  set: "009",
  text: "FULL DANCE CARD Your Princess characters get +1 {S} and +1 {W}.",
  cost: 5,
  strength: 5,
  willpower: 4,
  lore: 1,
  cardNumber: 4,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "9092b0fdad63a9babdad3d040dfc08f9ff244126",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const beastGraciousPrince: LorcanitoCharacterCard = {
//   id: "bgp",
//   missingTestCase: true,
//   name: "Beast",
//   title: "Gracious Prince",
//   characteristics: ["storyborn", "hero", "prince"],
//   text: "FULL DANCE CARD Your Princess characters get +1 {S} and +1 {W}.",
//   type: "character",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 5,
//   strength: 5,
//   willpower: 4,
//   illustrator: "",
//   number: 4,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 649953,
//   },
//   rarity: "rare",
//   abilities: [
//     {
//       type: "static",
//       ability: "effects",
//       name: "FULL DANCE CARD",
//       text: "Your Princess characters get +1 {W}",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "willpower",
//           amount: 1,
//           modifier: "add",
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "characteristics", value: ["princess"] },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     },
//     {
//       type: "static",
//       ability: "effects",
//       name: "FULL DANCE CARD",
//       text: "Your Princess characters get +1 {S}",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 1,
//           modifier: "add",
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "characteristics", value: ["princess"] },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   lore: 1,
// };
//
