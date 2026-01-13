import type { CharacterCard } from "@tcg/lorcana-types";

export const flotsamJetsamEntanglingEels: CharacterCard = {
  id: "1j0",
  cardType: "character",
  name: "Flotsam & Jetsam",
  version: "Entangling Eels",
  fullName: "Flotsam & Jetsam - Entangling Eels",
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "004",
  text: "Shift: Discard 2 cards (You may discard 2 cards to play this on top of one of your characters named Flotsam or Jetsam.)\n(This character counts as being named both Flotsam and Jetsam.)",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  cardNumber: 44,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c63d1e30731763bca52de192578836dccb9a5fb1",
  },
  abilities: [],
  classifications: ["Floodborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const flotsamAndJetsamEntanglingEels: LorcanitoCharacterCard = {
//   id: "pgn",
//   missingTestCase: true,
//   name: "Flotsam & Jetsam",
//   additionalNames: ["Flotsam", "Jetsam"],
//   title: "Entangling Eels",
//   characteristics: ["floodborn", "ally"],
//   text: "**Shift: Discard 2 cards** _(You may discard 2 cards to play this on top of one of your characters named Flotsam or Jetsam.)_\n\n_(This character counts as being named both Flotsam and Jetsam)_",
//   type: "character",
//   abilities: [
//     shiftAbility(
//       [
//         {
//           type: "card",
//           action: "discard",
//           amount: 2,
//           filters: [
//             { filter: "zone", value: "hand" },
//             { filter: "owner", value: "self" },
//             { filter: "source", value: "other" },
//           ],
//         },
//       ],
//       ["Flotsam", "Jetsam"],
//       "**Shift: Discard 2 cards** _(You may discard 2 cards to play this on top of one of your characters named Flotsam or Jetsam.)_\n\n_(This character counts as being named both Flotsam and Jetsam)_",
//     ),
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 6,
//   strength: 5,
//   willpower: 5,
//   lore: 2,
//   illustrator: "Brian Kesinger",
//   number: 44,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 547764,
//   },
//   rarity: "uncommon",
// };
//
