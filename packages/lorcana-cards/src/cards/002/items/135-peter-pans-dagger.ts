import type { ItemCard } from "@tcg/lorcana-types";

export const peterPansDagger: ItemCard = {
  id: "hwz",
  cardType: "item",
  name: "Peter Pan's Dagger",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "002",
  text: "Your characters with Evasive get +1 {S}.",
  cost: 2,
  cardNumber: 135,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "40927c4f37a9c377366de9cff761fa64f0580f95",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { EffectStaticAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const peterPansDagger: LorcanitoItemCard = {
//   id: "z0a",
//
//   name: "Peter Pan's Dagger",
//   characteristics: ["item"],
//   text: "Your characters with **Evasive** get +1 {S}.",
//   type: "item",
//   abilities: [
//     {
//       type: "static",
//       ability: "effects",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 1,
//           modifier: "add",
//           duration: "static",
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "self" },
//               { filter: "ability", value: "evasive" },
//             ],
//           },
//         },
//       ],
//     } as EffectStaticAbility,
//   ],
//   flavour:
//     "Like so much other lore, Peter Pan's dagger was safe in the Great Illuminary until the flood.",
//   colors: ["ruby"],
//   cost: 2,
//   illustrator: "Leonardo Giammichele",
//   number: 135,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527761,
//   },
//   rarity: "common",
// };
//
