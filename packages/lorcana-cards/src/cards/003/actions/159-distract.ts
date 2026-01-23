import type { ActionCard } from "@tcg/lorcana-types";

export const distract: ActionCard = {
  id: "1un",
  cardType: "action",
  name: "Distract",
  inkType: ["sapphire"],
  set: "003",
  text: "Chosen character gets -2 {S} this turn. Draw a card.",
  cost: 2,
  cardNumber: 159,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "efed43f00fc8ef2ffa9a90270aa7a41a14b24f8c",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const distract: LorcanitoActionCard = {
//   id: "hb0",
//   name: "Distract",
//   characteristics: ["action"],
//   text: "Chosen character gets -2 {S} this turn. Draw a card.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Distract",
//       text: "Chosen character gets -2 {S} this turn. Draw a card.",
//       resolveEffectsIndividually: true,
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 2,
//           modifier: "subtract",
//           duration: "turn",
//           until: true,
//           target: chosenCharacter,
//         },
//         drawACard,
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 2,
//   illustrator: "Giuseppe de Maio",
//   number: 159,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 532640,
//   },
//   rarity: "common",
// };
//
