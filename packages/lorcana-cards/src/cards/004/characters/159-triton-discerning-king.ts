import type { CharacterCard } from "@tcg/lorcana-types";

export const tritonDiscerningKing: CharacterCard = {
  id: "rj9",
  cardType: "character",
  name: "Triton",
  version: "Discerning King",
  fullName: "Triton - Discerning King",
  inkType: ["sapphire"],
  franchise: "Little Mermaid",
  set: "004",
  text: "CONSIGN TO THE DEPTHS {E}, Banish one of your items — Gain 3 lore.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 159,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "633d4a96c208e764155fc83b9f94d76fda5454b9",
  },
  abilities: [],
  classifications: ["Storyborn", "King"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   mayBanish,
//   youGainLore,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const tritonDiscerningKing: LorcanitoCharacterCard = {
//   id: "w33",
//   missingTestCase: true,
//   name: "Triton",
//   title: "Discerning King",
//   characteristics: ["storyborn", "king"],
//   text: "**CONSIGN TO THE DEPTHS** {E}, Banish one of your items − Gain 3 lore.",
//   type: "character",
//   abilities: [
//     {
//       type: "activated",
//       name: "Consign To The Depths",
//       text: "{E}, Banish one of your items − Gain 3 lore.",
//       costs: [{ type: "exert" }],
//       effects: [
//         mayBanish({
//           type: "card",
//           value: 1,
//           filters: [
//             { filter: "owner", value: "self" },
//             { filter: "type", value: "item" },
//             { filter: "zone", value: "play" },
//           ],
//         }),
//         youGainLore(3),
//       ],
//     },
//   ],
//   flavour: "If this is the only way, so be it.",
//   colors: ["sapphire"],
//   cost: 3,
//   strength: 3,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Diogo Saito",
//   number: 159,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 549621,
//   },
//   rarity: "rare",
// };
//
