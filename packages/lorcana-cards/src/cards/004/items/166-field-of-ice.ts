import type { ItemCard } from "@tcg/lorcana-types";

export const fieldOfIce: ItemCard = {
  id: "1kk",
  cardType: "item",
  name: "Field of Ice",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "004",
  text: "ICY DEFENSE Whenever you play a character, they gain Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
  cost: 3,
  cardNumber: 166,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "cc7f8815217a006923e994d8abffb2824694e76f",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverYouPlayACharacter } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const fieldOfIce: LorcanitoItemCard = {
//   id: "r97",
//   missingTestCase: true,
//   name: "Field of Ice",
//   characteristics: ["item"],
//   text: "**ICY DEFENSE** Whenever you play a character, they gain **Resist** +1 until the start of your next turn. _(Damage dealt to them is reduced by 1.)_",
//   type: "item",
//   abilities: [
//     wheneverYouPlayACharacter({
//       name: "Icy Defense",
//       text: "Whenever you play a character, they gain **Resist** +1 until the start of your next turn. _(Damage dealt to them is reduced by 1.)_",
//       effects: [
//         {
//           type: "ability",
//           ability: "resist",
//           modifier: "add",
//           amount: 1,
//           duration: "next_turn",
//           until: true,
//           target: chosenCharacter,
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 3,
//   illustrator: "Mariana Moreno",
//   number: 166,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 548594,
//   },
//   rarity: "rare",
// };
//
