import type { CharacterCard } from "@tcg/lorcana-types";

export const theQueenDiviner: CharacterCard = {
  id: "aeu",
  cardType: "character",
  name: "The Queen",
  version: "Diviner",
  fullName: "The Queen - Diviner",
  inkType: ["sapphire"],
  franchise: "Snow White",
  set: "004",
  text: "CONSULT THE SPELLBOOK {E} — Look at the top 4 cards of your deck. You may reveal an item card and put it into your hand. If that item costs 3 or less, you may play it for free instead and it enters play exerted. Put the rest on the bottom of your deck in any order.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 156,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "25872e2f6a7538f1bad704261005852bd2804752",
  },
  abilities: [],
  classifications: ["Dreamborn", "Villain", "Queen", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const theQueenDiviner: LorcanitoCharacterCard = {
//   id: "ngo",
//   name: "The Queen",
//   title: "Diviner",
//   characteristics: ["dreamborn", "queen", "sorcerer", "villain"],
//   text: "**CONSULT THE Spellbook** {E} – Look at the top 4 cards of your deck. You may reveal an item card and put it into your hand. If that item card costs 3 or less, you may play that item for free and it enters play exerted. Put the rest on the bottom of your deck in any order.",
//   type: "character",
//   abilities: [
//     {
//       type: "activated",
//       name: "Consult The Spellbook",
//       text: "{E} – Look at the top 4 cards of your deck. You may reveal an item card and put it into your hand. If that item card costs 3 or less, you may play that item for free and it enters play exerted. Put the rest on the bottom of your deck in any order.",
//       costs: [{ type: "exert" }],
//       effects: [
//         {
//           type: "scry",
//           amount: 4,
//           mode: "bottom",
//           shouldRevealTutored: true,
//           target: self,
//           limits: {
//             bottom: 4,
//             play: 1,
//             top: 0,
//             inkwell: 0,
//           },
//           playFilters: [
//             {
//               filter: "attribute",
//               value: "cost",
//               comparison: { operator: "lte", value: 3 },
//             },
//           ],
//           tutorFilters: [
//             { filter: "owner", value: "self" },
//             { filter: "zone", value: "deck" },
//             { filter: "type", value: "item" },
//           ],
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 3,
//   strength: 3,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Mel Milton",
//   number: 156,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550610,
//   },
//   rarity: "legendary",
// };
//
