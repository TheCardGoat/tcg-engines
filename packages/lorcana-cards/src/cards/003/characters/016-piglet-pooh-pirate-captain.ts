import type { CharacterCard } from "@tcg/lorcana-types";

export const pigletPoohPirateCaptain: CharacterCard = {
  id: "51i",
  cardType: "character",
  name: "Piglet",
  version: "Pooh Pirate Captain",
  fullName: "Piglet - Pooh Pirate Captain",
  inkType: ["amber"],
  franchise: "Winnie the Pooh",
  set: "003",
  text: "AND I'M THE CAPTAIN! While you have 2 or more other characters in play, this character gets +2 {L}.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 16,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "122c433c05a0334dea67706084da9d47eef28c95",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Pirate", "Captain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const pigletPoohPirateCaptain: LorcanitoCharacterCard = {
//   id: "ojq",
//   name: "Piglet",
//   title: "Pooh Pirate Captain",
//   characteristics: ["hero", "dreamborn", "pirate", "captain"],
//   text: "**AND I'M THE CAPTAIN!** While you have 2 or more other characters in play, this characters gets +2 {L}.",
//   type: "character",
//   abilities: [
//     whileConditionThisCharacterGets({
//       name: "And I'm the Captain!",
//       text: "While you have 2 or more other characters in play, this characters gets +2 {L}.",
//       attribute: "lore",
//       amount: 2,
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
//     }),
//   ],
//   flavour: "Ahoy! There's lore out there, and I'm g-gonna find it!",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 2,
//   strength: 2,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Grace Tran",
//   number: 16,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 531822,
//   },
//   rarity: "super_rare",
// };
//
