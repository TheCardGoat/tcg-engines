import type { ActionCard } from "@tcg/lorcana-types";

export const unfortunateSituation: ActionCard = {
  id: "oyi",
  cardType: "action",
  name: "Unfortunate Situation",
  inkType: ["steel"],
  franchise: "Lion King",
  set: "006",
  text: "Each opponent chooses one of their characters and deals 4 damage to them.",
  cost: 4,
  cardNumber: 199,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "59f406a0ef34537d045dbbde2779e7a0977de7e1",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacterOfYours } from "@lorcanito/lorcana-engine/abilities/targets";
// import { dealDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const unfortunateSituation: LorcanitoActionCard = {
//   id: "wcu",
//   missingTestCase: true,
//   name: "Unfortunate Situation",
//   characteristics: ["action"],
//   text: "Each opponent chooses one of their characters and deals 4 damage to them.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       responder: "opponent",
//       effects: [dealDamageEffect(4, chosenCharacterOfYours)],
//     },
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 4,
//   illustrator: "Mariano Moreno",
//   number: 199,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 587974,
//   },
//   rarity: "uncommon",
// };
//
