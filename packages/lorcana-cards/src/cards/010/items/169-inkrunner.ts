import type { ItemCard } from "@tcg/lorcana-types";

export const inkrunner: ItemCard = {
  id: "u80",
  cardType: "item",
  name: "Inkrunner",
  inkType: ["sapphire"],
  franchise: "Lorcana",
  set: "010",
  text: "PREFLIGHT CHECK When you play this item, draw a card.\nREADY TO RIDE {E}, 1 {I} - Chosen character gains Alert this turn. (They can challenge as if they had Evasive.)",
  cost: 2,
  cardNumber: 169,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6cecb04c1876e48d66d77a98284509e6af7937d8",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const inkrunner: LorcanitoItemCard = {
//   id: "h3t",
//   name: "Inkrunner",
//   characteristics: ["item"],
//   text: "PREFLIGHT CHECK When you play this item, draw a card.\nREADY TO RIDE {E}, 1 {I} - Chosen character gains Alert this turn. (They can challenge as if they had Evasive.)",
//   type: "item",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 2,
//   illustrator: "Jeremy Adams",
//   number: 169,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659389,
//   },
//   rarity: "uncommon",
//   abilities: [
//     whenYouPlayThis({
//       name: "PREFLIGHT CHECK",
//       text: "When you play this item, draw a card.",
//       effects: [
//         {
//           type: "draw",
//           amount: 1,
//           target: {
//             type: "player",
//             value: "self",
//           },
//         },
//       ],
//     }),
//     {
//       type: "activated",
//       name: "READY TO RIDE",
//       text: "{E}, 1 {I} - Chosen character gains Alert this turn. (They can challenge as if they had Evasive.)",
//       costs: [{ type: "exert" }, { type: "ink", amount: 1 }],
//       effects: [
//         {
//           type: "ability",
//           ability: "alert",
//           modifier: "add",
//           duration: "turn",
//           until: true,
//           target: chosenCharacter,
//         },
//       ],
//     },
//   ],
// };
//
