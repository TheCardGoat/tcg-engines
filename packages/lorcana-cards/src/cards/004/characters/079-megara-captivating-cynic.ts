import type { CharacterCard } from "@tcg/lorcana-types";

export const megaraCaptivatingCynic: CharacterCard = {
  id: "13g",
  cardType: "character",
  name: "Megara",
  version: "Captivating Cynic",
  fullName: "Megara - Captivating Cynic",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "004",
  text: "SHADY DEAL When you play this character, choose and discard a card or banish this character.",
  cost: 3,
  strength: 3,
  willpower: 6,
  lore: 2,
  cardNumber: 79,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8e31efeb3393cdf6117bf0de38f47c93204d5f89",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { discardACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const megaraCaptivatingCynic: LorcanitoCharacterCard = {
//   id: "spm",
//   name: "Megara",
//   title: "Captivating Cynic",
//   characteristics: ["dreamborn", "ally"],
//   text: "**SHADY DEAL** When you play this character, chose and discard a card or banish this character.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "SHADY DEAL",
//       optional: true,
//       text: "When you play this character, chose and discard a card or banish this character.",
//       effects: [discardACard],
//       onCancelLayer: {
//         type: "resolution",
//         effects: [
//           {
//             type: "banish",
//             target: {
//               type: "card",
//               value: "all",
//               filters: [{ filter: "source", value: "self" }],
//             },
//           },
//         ],
//       },
//     },
//   ],
//   flavour: "With love, there's always a catch.",
//   colors: ["emerald"],
//   cost: 3,
//   strength: 3,
//   willpower: 6,
//   lore: 2,
//   illustrator: "Yu Nguyėn",
//   number: 79,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 549632,
//   },
//   rarity: "common",
// };
//
