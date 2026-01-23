import type { ItemCard } from "@tcg/lorcana-types";

export const steelChromicon: ItemCard = {
  id: "1lw",
  cardType: "item",
  name: "Steel Chromicon",
  inkType: ["steel"],
  franchise: "Lorcana",
  set: "005",
  text: "STEEL LIGHT {E} — Deal 1 damage to chosen character.",
  cost: 6,
  cardNumber: 202,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d0ac5490b2e8a8b66aac820aa3ef992619b9524f",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { dealDamageToChosenCharacter } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const steelChromicon: LorcanitoItemCard = {
//   id: "yz9",
//   missingTestCase: true,
//   name: "Steel Chromicon",
//   characteristics: ["item"],
//   text: "**STEEL LIGHT** {E} – Deal 1 damage to chosen character.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "STEEL LIGHT",
//       text: "{E} – Deal 1 damage to chosen character.",
//       costs: [{ type: "exert" }],
//       effects: [dealDamageToChosenCharacter(1)],
//     },
//   ],
//   flavour: "Strong in will, strong in battle.\n−Inscription",
//   colors: ["steel"],
//   cost: 6,
//   illustrator: "Dustin Panzino",
//   number: 202,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 560101,
//   },
//   rarity: "uncommon",
// };
//
