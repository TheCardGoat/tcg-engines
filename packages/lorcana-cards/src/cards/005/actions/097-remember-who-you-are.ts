import type { ActionCard } from "@tcg/lorcana-types";

export const rememberWhoYouAre: ActionCard = {
  id: "1ps",
  cardType: "action",
  name: "Remember Who You Are",
  inkType: ["emerald"],
  franchise: "Lion King",
  set: "005",
  text: "If chosen opponent has more cards in their hand than you, draw cards until you have the same number.",
  cost: 4,
  cardNumber: 97,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "dc6f4191954689164fd82fe44da42224a2a0f1c7",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { drawCardsUntilYouHaveSameNumberOfCardsAsOpponent } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const rememberWhoYouAre: LorcanitoActionCard = {
//   id: "jps",
//   missingTestCase: true,
//   name: "Remember Who You Are",
//   characteristics: ["action"],
//   text: "If chosen opponent has more cards in their hand than you, draw cards until you have the same number.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       effects: [drawCardsUntilYouHaveSameNumberOfCardsAsOpponent],
//     },
//   ],
//   colors: ["emerald"],
//   cost: 4,
//   illustrator: "Cory Godbey",
//   number: 97,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 556975,
//   },
//   rarity: "rare",
// };
//
