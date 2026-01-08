import type { CharacterCard } from "@tcg/lorcana-types";

export const theQueenDisguisedPeddler: CharacterCard = {
  id: "fex",
  cardType: "character",
  name: "The Queen",
  version: "Disguised Peddler",
  fullName: "The Queen - Disguised Peddler",
  inkType: ["emerald"],
  franchise: "Snow White",
  set: "002",
  text: "A PERFECT DISGUISE {E}, Choose and discard a character card — Gain lore equal to the discarded character's {L}.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 0,
  cardNumber: 93,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "378e912a20a6e0f185bf32a266c970f3ffe1a3b3",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Queen"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const theQueenDisguisedPeddler: LorcanitoCharacterCard = {
//   id: "htg",
//   name: "The Queen",
//   title: "Disguised Peddler",
//   characteristics: ["queen", "storyborn", "villain"],
//   text: "**A PERFECT DISGUISE** {E}, Choose and discard a character card − Gain lore equal to the discarded character's {L}.",
//   type: "character",
//   abilities: [
//     {
//       type: "activated",
//       name: "A Perfect Disguise",
//       text: "{E}, Choose and discard a character card − Gain lore equal to the discarded character's {L}.",
//       costs: [{ type: "exert" }], // Discard a card should be a cost
//       effects: [
//         {
//           type: "discard",
//           amount: 1,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "hand" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//         {
//           type: "lore",
//           modifier: "add",
//           amount: {
//             dynamic: true,
//             target: { attribute: "lore" },
//           },
//           target: self,
//         },
//       ],
//     },
//   ],
//   flavour: '"This is no ordinary apple . . ."',
//   colors: ["emerald"],
//   cost: 3,
//   lore: 0,
//   strength: 2,
//   willpower: 3,
//   illustrator: "Leonardo Giammichele",
//   number: 93,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527273,
//   },
//   rarity: "super_rare",
// };
//
