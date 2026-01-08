import type { ActionCard } from "@tcg/lorcana-types";

export const healingTouch: ActionCard = {
  id: "9qq",
  cardType: "action",
  name: "Healing Touch",
  inkType: ["amber"],
  franchise: "Frozen",
  set: "005",
  text: "Remove up to 4 damage from chosen character. Draw a card.",
  cost: 3,
  cardNumber: 26,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "231ce73a39f2059eb63484bf1ded08a47f4ed94a",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const healingTouch: LorcanitoActionCard = {
//   id: "i7a",
//   name: "Healing Touch",
//   characteristics: ["action"],
//   text: "Remove up to 4 damage from chosen character. Draw a card.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       text: "Remove up to 4 damage from chosen character. Draw a card.",
//       resolveEffectsIndividually: true,
//       effects: [
//         {
//           type: "heal",
//           amount: 4,
//           upTo: true,
//           target: chosenCharacter,
//         },
//         drawACard,
//       ],
//     },
//   ],
//   flavour:
//     "The heart is not so easily changed, but the head can be persuaded.\n—Grand Pabbie",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 3,
//   illustrator: "Mariana Moreno",
//   number: 26,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561259,
//   },
//   rarity: "common",
// };
//
