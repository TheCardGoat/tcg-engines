import type { ItemCard } from "@tcg/lorcana-types";

export const gumboPot: ItemCard = {
  id: "1ab",
  cardType: "item",
  name: "Gumbo Pot",
  inkType: ["sapphire"],
  franchise: "Princess and the Frog",
  set: "002",
  text: "THE BEST I'VE EVER TASTED {E} — Remove 1 damage each from up to 2 chosen characters.",
  cost: 2,
  cardNumber: 167,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a68784ab7dfc3be9c02a52d4043185cfe4108706",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const gumboPot: LorcanitoItemCard = {
//   id: "xf3",
//
//   name: "Gumbo Pot",
//   characteristics: ["item"],
//   text: "**THE BEST I'VE EVER TASTED** {E} − Remove 1 damage each from up to 2 chosen characters.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "The Best I've Ever Tasted",
//       text: "{E} − Remove 1 damage each from up to 2 chosen characters.",
//       optional: false,
//       costs: [{ type: "exert" }],
//       effects: [
//         {
//           type: "heal",
//           amount: 1,
//           target: {
//             type: "card",
//             value: 2,
//             upTo: true,
//             filters: [
//               { filter: "owner", value: "self" },
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     } as ActivatedAbility,
//   ],
//   flavour: "A gift this special just got to be shared. \n−James",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 2,
//   illustrator: "Tanisha Cherislin",
//   number: 167,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 525309,
//   },
//   rarity: "common",
// };
//
