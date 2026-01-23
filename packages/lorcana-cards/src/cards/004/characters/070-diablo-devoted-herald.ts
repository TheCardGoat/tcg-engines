import type { CharacterCard } from "@tcg/lorcana-types";

export const diabloDevotedHerald: CharacterCard = {
  id: "1g3",
  cardType: "character",
  name: "Diablo",
  version: "Devoted Herald",
  fullName: "Diablo - Devoted Herald",
  inkType: ["emerald"],
  franchise: "Sleeping Beauty",
  set: "004",
  text: "Shift: Discard an action card (You may discard an action card to play this on top of one of your characters named Diablo.)\nEvasive (Only characters with Evasive can challenge this character.)\nCIRCLE FAR AND WIDE During each opponent's turn, whenever they draw a card while this character is exerted, you may draw a card.",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 70,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "bd36724ac6baa50386ab4443e026f5d0e787b2cf",
  },
  abilities: [],
  classifications: ["Floodborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   evasiveAbility,
//   shiftAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverOpponentDrawsACard } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const diabloDevotedHerald: LorcanitoCharacterCard = {
//   id: "hxs",
//   name: "Diablo",
//   title: "Devoted Herald",
//   characteristics: ["floodborn", "ally"],
//   text: "**Shift: Discard an action card** _(You may discard an action card to play this on top of one of your characters named Diablo.)_\n\n**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n**CIRCLE FAR AND WIDE** During each opponent's turn, whenever they draw a card while this character is exerted, you may draw a card.",
//   type: "character",
//   abilities: [
//     evasiveAbility,
//     shiftAbility(
//       [
//         {
//           type: "card",
//           action: "discard",
//           amount: 1,
//           filters: [
//             { filter: "zone", value: "hand" },
//             { filter: "owner", value: "self" },
//             { filter: "type", value: "action" },
//           ],
//         },
//       ],
//       "Diablo",
//       "**Shift: Discard an action card** _(You may discard an action card to play this on top of one of your characters named Diablo.)_",
//     ),
//     wheneverOpponentDrawsACard({
//       name: "Circle far and wide",
//       text: "During each opponent's turn, whenever they draw a card while this character is exerted, you may draw a card.",
//       optional: true,
//       effects: [drawACard],
//       conditions: [
//         { type: "exerted" },
//         {
//           type: "during-turn",
//           value: "opponent",
//         },
//       ],
//     }),
//   ],
//   colors: ["emerald"],
//   cost: 3,
//   strength: 2,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Alice Pisoni",
//   number: 70,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 547765,
//   },
//   rarity: "legendary",
// };
//
