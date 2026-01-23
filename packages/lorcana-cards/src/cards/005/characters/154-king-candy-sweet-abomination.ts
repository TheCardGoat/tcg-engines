import type { CharacterCard } from "@tcg/lorcana-types";

export const kingCandySweetAbomination: CharacterCard = {
  id: "q61",
  cardType: "character",
  name: "King Candy",
  version: "Sweet Abomination",
  fullName: "King Candy - Sweet Abomination",
  inkType: ["sapphire"],
  franchise: "Wreck It Ralph",
  set: "005",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named King Candy.)\nCHANGING THE CODE When you play this character, you may draw 2 cards, then put a card from your hand on the bottom of your deck.",
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 154,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5e50dc86485330fa31a424a5ef8789c56472efd4",
  },
  abilities: [],
  classifications: ["Floodborn", "Villain", "King", "Racer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { drawXCards } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const kingCandySweetAbomination: LorcanitoCharacterCard = {
//   id: "puc",
//   name: "King Candy",
//   title: "Sweet Abomination",
//   characteristics: ["floodborn", "villain", "king"],
//   text: "**Shift** 3 _(You may pay 3 {I} to play this on top of one of your characters named King Candy.)_\n \n**CHANGING THE CODE** When you play this character, you may draw 2 cards, then put a card from your hand on the bottom of your deck.",
//   type: "character",
//   abilities: [
//     shiftAbility(3, "King Candy"),
//     {
//       type: "resolution",
//       name: "Changing The Code",
//       text: "When you play this character, you may draw 2 cards, then put a card from your hand on the bottom of your deck.",
//       optional: true,
//       resolveEffectsIndividually: true,
//       effects: [
//         drawXCards(2),
//         {
//           type: "move",
//           to: "deck",
//           bottom: true,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "zone", value: "hand" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   colors: ["sapphire"],
//   cost: 5,
//   strength: 3,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Jake Parker",
//   number: 154,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 559790,
//   },
//   rarity: "uncommon",
// };
//
