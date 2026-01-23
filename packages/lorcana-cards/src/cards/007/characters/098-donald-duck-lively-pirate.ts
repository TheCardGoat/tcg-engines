import type { CharacterCard } from "@tcg/lorcana-types";

export const donaldDuckLivelyPirate: CharacterCard = {
  id: "17f",
  cardType: "character",
  name: "Donald Duck",
  version: "Lively Pirate",
  fullName: "Donald Duck - Lively Pirate",
  inkType: ["emerald"],
  set: "007",
  text: "DUCK OF ACTION Whenever this character is challenged, you may return an action card that isn't a song card from your discard to your hand.",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 2,
  cardNumber: 98,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "9c7d800c6c0e522c7c7224a1dfb5b79bcac0edee",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Pirate"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { whenChallenged } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const donaldDuckLivelyPirate: LorcanitoCharacterCard = {
//   id: "lp9",
//   name: "Donald Duck",
//   title: "Lively Pirate",
//   characteristics: ["dreamborn", "hero", "pirate"],
//   text: "DUCK OF ACTION Whenever this character is challenged, you may return an action card that isn't a song from your discard to your hand.",
//   type: "character",
//   abilities: [
//     whenChallenged({
//       name: "DUCK OF ACTION",
//       text: "Whenever this character is challenged, you may return an action card that isn't a song from your discard to your hand.",
//       optional: true,
//       responder: "self",
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "owner", value: "self" },
//               { filter: "type", value: ["action"] },
//               { filter: "characteristics", value: ["song"], negate: true },
//               { filter: "zone", value: "discard" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   inkwell: false,
//   colors: ["emerald"],
//   cost: 2,
//   strength: 1,
//   willpower: 1,
//   illustrator: "João Moura",
//   number: 98,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619458,
//   },
//   rarity: "rare",
//   lore: 2,
// };
//
