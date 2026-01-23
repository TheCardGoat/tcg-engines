import type { ItemCard } from "@tcg/lorcana-types";

export const cleansingRainwater: ItemCard = {
  id: "w7f",
  cardType: "item",
  name: "Cleansing Rainwater",
  inkType: ["amber"],
  franchise: "Raya and the Last Dragon",
  set: "003",
  text: "ANCIENT POWER Banish this item — Remove up to 2 damage from each of your characters.",
  cost: 2,
  cardNumber: 29,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "741296e5c7fe289b3e57d105fe603434b8320ffa",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const cleansingRainwater: LorcanitoItemCard = {
//   id: "vlr",
//   name: "Cleansing Rainwater",
//   characteristics: ["item"],
//   text: "**ANCIENT POWER** Banish this item – Remove up to 2 damage from each of your characters.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "ANCIENT POWER",
//       text: "Banish this item – Remove up to 2 damage from each of your characters.",
//       costs: [{ type: "banish" }],
//       effects: [
//         {
//           type: "heal",
//           amount: 2,
//           upTo: true,
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "owner", value: "self" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     } as ActivatedAbility,
//   ],
//   flavour: "Rainwater lands as stone melts and dragons fly again.",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 2,
//   illustrator: 'Michael "Cookie" Niewiadomy',
//   number: 29,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 537406,
//   },
//   rarity: "common",
// };
//
