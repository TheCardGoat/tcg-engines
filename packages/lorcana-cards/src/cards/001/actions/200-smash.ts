import type { ActionCard } from "@tcg/lorcana-types";
import { dealDamage } from "../../ability-helpers";

export const smashundefined: ActionCard = {
  id: "ub4",
  cardType: "action",
  name: "Smash",
  version: "undefined",
  fullName: "Smash - undefined",
  inkType: ["steel"],
  franchise: "Disney",
  set: "001",
  text: "Deal 3 damage to chosen character.",
  cost: 3,
  cardNumber: 200,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      id: "ub4-1",
      text: "Deal 3 damage to chosen character.",
      effect: dealDamage(3, {
        selector: "chosen",
        count: 1,
        owner: "any",
        zones: ["play"],
        cardTypes: ["character"],
      }),
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const smash: LorcanitoActionCard = {
//   id: "ub4",
//   reprints: ["zfz"],
//   name: "Smash",
//   characteristics: ["action"],
//   text: "Deal 3 damage to chosen character.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Smash",
//       text: "Deal 3 damage to chosen character.",
//       effects: [
//         {
//           type: "damage",
//           amount: 3,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour: '"Go away!"',
//   inkwell: true,
//   colors: ["steel"],
//   cost: 3,
//   illustrator: "Simangaliso Sibaya",
//   number: 200,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508943,
//   },
//   rarity: "uncommon",
// };
//
