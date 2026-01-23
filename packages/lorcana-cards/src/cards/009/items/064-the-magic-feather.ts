import type { ItemCard } from "@tcg/lorcana-types";

export const theMagicFeather: ItemCard = {
  id: "cfx",
  cardType: "item",
  name: "The Magic Feather",
  inkType: ["amethyst"],
  franchise: "Dumbo",
  set: "009",
  text: "NOW YOU CAN FLY! When you play this item, choose a character of yours. While this item is in play, that character gains Evasive. (Only characters with Evasive can challenge them.)\nGROUNDED 3 {I} — Return this item to your hand.",
  cost: 2,
  cardNumber: 64,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2cd7f5750cf7213ca57bfd25757bf2c0c01548d6",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
// import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { returnThisCardToHand } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const theMagicFeather: LorcanitoItemCard = {
//   id: "cxi",
//   missingTestCase: false,
//   name: "The Magic Feather",
//   characteristics: ["item"],
//   text: "NOW YOU CAN FLY! When you play this item, choose a character of yours. While this item is in play, that character gains Evasive.\nGROUNDED 3 {I} – Return this item to your hand.",
//   type: "item",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 2,
//   illustrator: "Mariana Moreno",
//   number: 64,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 647677,
//   },
//   rarity: "rare",
//   abilities: [
//     whenYouPlayThis({
//       name: "NOW YOU CAN FLY!",
//       text: "When you play this item, choose a character of yours. While this item is in play, that character gains Evasive.",
//       effects: [
//         {
//           type: "ability",
//           ability: "evasive",
//           duration: "while_in_play",
//           modifier: "add",
//           target: chosenCharacter,
//         },
//       ],
//     }),
//     {
//       type: "activated",
//       costs: [{ type: "ink", amount: 3 }],
//       name: "GROUNDED",
//       text: "3 {I} – Return this item to your hand.",
//       effects: [returnThisCardToHand],
//     },
//   ],
// };
//
