import type { CharacterCard } from "@tcg/lorcana-types";

export const ladyTremaineBitterlyJealous: CharacterCard = {
  id: "1n1",
  cardType: "character",
  name: "Lady Tremaine",
  version: "Bitterly Jealous",
  fullName: "Lady Tremaine - Bitterly Jealous",
  inkType: ["emerald"],
  franchise: "Cinderella",
  set: "007",
  text: "THAT'S QUITE ENOUGH {E} — Return chosen damaged character to their player's hand. Then, each opponent discards a card at random.",
  cost: 6,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 115,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d6d17b4712d5e27c288f4076156bcc3e4c0ddb28",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { opponentDiscardsARandomCard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const ladyTremaineBitterlyJealous: LorcanitoCharacterCard = {
//   id: "zl6",
//   name: "Lady Tremaine",
//   title: "Bitterly Jealous",
//   characteristics: ["storyborn", "villain"],
//   text: "THAT'S QUITE ENOUGH {E} – Return chosen damaged character to their player's hand. Then, each opponent discards a card at random.",
//   type: "character",
//   abilities: [
//     {
//       type: "activated",
//       costs: [{ type: "exert" }],
//       name: "That's Quite Enough",
//       text: "Return chosen damaged character to their player's hand. Then, each opponent discards a card at random.",
//       resolveEffectsIndividually: true,
//       dependentEffects: true,
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "zone", value: "play" },
//               { filter: "type", value: ["character"] },
//               { filter: "status", value: "damaged" },
//             ],
//           },
//         },
//         opponentDiscardsARandomCard,
//       ],
//     },
//   ],
//   inkwell: false,
//   colors: ["emerald"],
//   cost: 6,
//   strength: 3,
//   willpower: 3,
//   illustrator: "Goku Kumatori",
//   number: 115,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619469,
//   },
//   rarity: "legendary",
//   lore: 2,
// };
//
