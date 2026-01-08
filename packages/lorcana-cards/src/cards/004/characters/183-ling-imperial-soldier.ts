import type { CharacterCard } from "@tcg/lorcana-types";

export const lingImperialSoldier: CharacterCard = {
  id: "joz",
  cardType: "character",
  name: "Ling",
  version: "Imperial Soldier",
  fullName: "Ling - Imperial Soldier",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "004",
  text: "FULL OF SPIRIT Your Hero characters get +1 {S}.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 183,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "46fab1f4f08af604245e97f1b80242c4b74024c3",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const lingImperialSoldier: LorcanitoCharacterCard = {
//   id: "mp1",
//   missingTestCase: true,
//   name: "Ling",
//   title: "Imperial Soldier",
//   characteristics: ["storyborn", "ally"],
//   text: "**FULL OF SPIRIT** Your Hero characters get +1 {S}.",
//   type: "character",
//   abilities: [
//     {
//       type: "static",
//       ability: "effects",
//       name: "Full Of Spirit",
//       text: "Your Hero characters get +1 {S}.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 1,
//           modifier: "add",
//           target: {
//             type: "card",
//             value: "all",
//             excludeSelf: true,
//             filters: [
//               { filter: "owner", value: "self" },
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "characteristics", value: ["hero"] },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour: "A good friend is handy in a fight.",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 3,
//   strength: 3,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Michela Cacciatore / Giulia Priori",
//   number: 183,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 548195,
//   },
//   rarity: "uncommon",
// };
//
