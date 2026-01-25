import type { LocationCard } from "@tcg/lorcana-types";

export const sherwoodForestOutlawHideaway: LocationCard = {
  id: "1kh",
  cardType: "location",
  name: "Sherwood Forest",
  version: "Outlaw Hideaway",
  fullName: "Sherwood Forest - Outlaw Hideaway",
  inkType: ["emerald"],
  franchise: "Robin Hood",
  set: "005",
  text: "FOREST HOME Your characters named Robin Hood may move here for free.\nFAMILIAR TERRAIN Characters gain Ward and “{E}, 1 {I} — Deal 2 damage to chosen damaged character” while here. (Opponents can't choose them except to challenge.)",
  cost: 2,
  moveCost: 2,
  lore: 0,
  cardNumber: 101,
  inkable: true,
  externalIds: {
    ravensburger: "cb0b3f11503ac2065fa15cb7f7ee80a1d45319a9",
  },
  abilities: [
    {
      id: "1kh-1",
      text: "FOREST HOME Your characters named Robin Hood may move here for free.",
      name: "FOREST HOME",
      type: "static",
      effect: {
        type: "move-cost-reduction",
        filter: {
          name: "Robin Hood",
        },
        reduction: "free",
        location: "here",
      },
    },
    {
      id: "1kh-2",
      text: "FAMILIAR TERRAIN Characters gain Ward and “{E}, {d} {I} — Deal {d} damage to chosen damaged character” while here.",
      name: "FAMILIAR TERRAIN",
      type: "static",
      effect: {
        type: "grant-abilities-while-here",
        abilities: [
          {
            type: "keyword",
            keyword: "Ward",
          },
          {
            type: "activated",
            cost: {
              exert: true,
              ink: 1,
            },
            effect: {
              type: "deal-damage",
              amount: 2,
              target: {
                selector: "chosen",
                filters: [
                  {
                    type: "damaged",
                  },
                ],
              },
            },
          },
        ],
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import {
//   gainAbilityWhileHere,
//   wardAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const sherwoodForestOutlawHideaway: LorcanitoLocationCard = {
//   id: "pi0",
//   name: "Sherwood Forest",
//   title: "Outlaw Hideaway",
//   characteristics: ["location"],
//   text: '**FOREST HOME** Your characters named Robin Hood may move here for free. **FAMILIAR TERRAIN** Characters gain **Ward** and "{E} ,1 {I} −Deal 2 damage to chosen damaged character" while here. _(Opponents can\'t choose them except to challenge.)_',
//   type: "location",
//   abilities: [
//     // {
//     //   name: "**FOREST HOME**",
//     //   text: "Your characters named Robin Hood may move here for free.",
//     //   TODO: This is currently done as an if condition inside the onMove function in the CharacterModel
//     // },
//     gainAbilityWhileHere({
//       name: "Familiar Terrain",
//       text: "Characters gain **Ward**",
//       ability: wardAbility,
//     }),
//     gainAbilityWhileHere({
//       name: "Familiar Terrain",
//       text: "{E} – Deal 2 damage to chosen damaged character or location.",
//       ability: {
//         type: "activated",
//         name: "Familiar Terrain",
//         text: "{E} , 1 {I} − Deal 2 damage to chosen damaged character",
//         costs: [{ type: "exert" }, { type: "ink", amount: 1 }],
//         effects: [
//           {
//             type: "damage",
//             amount: 2,
//             target: {
//               type: "card",
//               value: 1,
//               filters: [
//                 { filter: "type", value: ["character"] },
//                 { filter: "zone", value: "play" },
//                 {
//                   filter: "status",
//                   value: "damage",
//                   comparison: { operator: "gte", value: 1 },
//                 },
//               ],
//             },
//           },
//         ],
//       },
//     }),
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 2,
//   willpower: 7,
//   illustrator: "Douglas De La Hoz",
//   number: 101,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 559088,
//   },
//   rarity: "rare",
//   moveCost: 2,
//   movementDiscounts: [
//     {
//       filters: [
//         {
//           filter: "attribute",
//           value: "name",
//           comparison: { operator: "eq", value: "Robin Hood" },
//         },
//       ],
//       amount: 0,
//     },
//   ],
// };
//
