import type { ActionCard } from "@tcg/lorcana-types";

export const seekingTheHalfCrown: ActionCard = {
  id: "4qr",
  cardType: "action",
  name: "Seeking the Half Crown",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "006",
  text: "For each Sorcerer character you have in play, you pay 1 {I} less to play this action.\nDraw 2 cards.",
  cost: 5,
  cardNumber: 64,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "111879cd3089326363423d333c1ab2112fc415da",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { whenYouPlayThisForEachYouPayLess } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { drawXCards } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const seekingTheHalfCrown: LorcanitoActionCard = {
//   id: "fdo",
//   missingTestCase: true,
//   name: "Seeking The Half Crown",
//   characteristics: ["action"],
//   text: "For each Sorcerer character you have in play, you pay 1 {I} less to play this action.\nDraw 2 cards.",
//   type: "action",
//   abilities: [
//     whenYouPlayThisForEachYouPayLess({
//       amount: {
//         dynamic: true,
//         filters: [
//           { filter: "owner", value: "self" },
//           { filter: "type", value: "character" },
//           { filter: "zone", value: "play" },
//           { filter: "characteristics", value: ["sorcerer"] },
//         ],
//       },
//     }),
//     {
//       type: "resolution",
//       effects: [drawXCards(2)],
//     },
//   ],
//   inkwell: false,
//   colors: ["amethyst"],
//   cost: 5,
//   illustrator: "French Carlomagno",
//   number: 64,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 593042,
//   },
//   rarity: "rare",
// };
//
