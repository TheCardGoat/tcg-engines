import type { CharacterCard } from "@tcg/lorcana-types";

export const christopherRobinAdventurer: CharacterCard = {
  id: "2pm",
  cardType: "character",
  name: "Christopher Robin",
  version: "Adventurer",
  fullName: "Christopher Robin - Adventurer",
  inkType: ["amber"],
  franchise: "Winnie the Pooh",
  set: "002",
  text: "WE'LL ALWAYS BE TOGETHER Whenever you ready this character, if you have 2 or more other characters in play, gain 2 lore.",
  cost: 6,
  strength: 2,
  willpower: 6,
  lore: 2,
  cardNumber: 2,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "09c622f4623326886425e229b1bd88910dc489bc",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverYouReadyThisCharacter } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const christopherRobinAdventurer: LorcanitoCharacterCard = {
//   id: "yf4",
//   name: "Christopher Robin",
//   title: "Adventurer",
//   characteristics: ["hero", "dreamborn"],
//   text: "**WE'LL ALWAYS BE TOGETHER** Whenever you ready this character, if you have 2 or more other characters in play, gain 2 lore.",
//   type: "character",
//   abilities: [
//     wheneverYouReadyThisCharacter({
//       name: "We'll Always Be Together",
//       text: "Whenever you ready this character, if you have 2 or more other characters in play, gain 2 lore.",
//       conditions: [
//         {
//           type: "filter",
//           comparison: {
//             operator: "gte",
//             value: 3,
//           },
//           filters: [
//             { filter: "type", value: "character" },
//             { filter: "zone", value: "play" },
//             { filter: "owner", value: "self" },
//           ],
//         },
//       ],
//       effects: [
//         {
//           type: "lore",
//           modifier: "add",
//           amount: 2,
//           target: self,
//         },
//       ],
//     }),
//   ],
//   flavour:
//     "Look, Pooh! Have you ever seen anything so grand? \n−Christopher Robin",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 6,
//   strength: 2,
//   willpower: 6,
//   lore: 2,
//   illustrator: "Eri Welli",
//   number: 2,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 526351,
//   },
//   rarity: "rare",
// };
//
