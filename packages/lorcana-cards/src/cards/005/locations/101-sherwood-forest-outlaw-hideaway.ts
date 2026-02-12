import type { LocationCard } from "@tcg/lorcana-types";

export const sherwoodForestOutlawHideaway: LocationCard = {
  abilities: [
    {
      effect: {
        filter: {
          name: "Robin Hood",
        },
        location: "here",
        reduction: "free",
        type: "move-cost-reduction",
      },
      id: "1kh-1",
      name: "FOREST HOME",
      text: "FOREST HOME Your characters named Robin Hood may move here for free.",
      type: "static",
    },
    {
      effect: {
        abilities: [
          {
            keyword: "Ward",
            type: "keyword",
          },
          {
            cost: {
              exert: true,
              ink: 1,
            },
            effect: {
              amount: 2,
              target: {
                filters: [
                  {
                    type: "damaged",
                  },
                ],
                selector: "chosen",
              },
              type: "deal-damage",
            },
            type: "activated",
          },
        ],
        type: "grant-abilities-while-here",
      },
      id: "1kh-2",
      name: "FAMILIAR TERRAIN",
      text: "FAMILIAR TERRAIN Characters gain Ward and “{E}, {d} {I} — Deal {d} damage to chosen damaged character” while here.",
      type: "static",
    },
  ],
  cardNumber: 101,
  cardType: "location",
  cost: 2,
  externalIds: {
    ravensburger: "cb0b3f11503ac2065fa15cb7f7ee80a1d45319a9",
  },
  franchise: "Robin Hood",
  fullName: "Sherwood Forest - Outlaw Hideaway",
  id: "1kh",
  inkType: ["emerald"],
  inkable: true,
  lore: 0,
  moveCost: 2,
  name: "Sherwood Forest",
  set: "005",
  text: "FOREST HOME Your characters named Robin Hood may move here for free.\nFAMILIAR TERRAIN Characters gain Ward and “{E}, 1 {I} — Deal 2 damage to chosen damaged character” while here. (Opponents can't choose them except to challenge.)",
  version: "Outlaw Hideaway",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// Import {
//   GainAbilityWhileHere,
//   WardAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// Export const sherwoodForestOutlawHideaway: LorcanitoLocationCard = {
//   Id: "pi0",
//   Name: "Sherwood Forest",
//   Title: "Outlaw Hideaway",
//   Characteristics: ["location"],
//   Text: '**FOREST HOME** Your characters named Robin Hood may move here for free. **FAMILIAR TERRAIN** Characters gain **Ward** and "{E} ,1 {I} −Deal 2 damage to chosen damaged character" while here. _(Opponents can\'t choose them except to challenge.)_',
//   Type: "location",
//   Abilities: [
//     // {
//     //   name: "**FOREST HOME**",
//     //   text: "Your characters named Robin Hood may move here for free.",
//     //   TODO: This is currently done as an if condition inside the onMove function in the CharacterModel
//     // },
//     GainAbilityWhileHere({
//       Name: "Familiar Terrain",
//       Text: "Characters gain **Ward**",
//       Ability: wardAbility,
//     }),
//     GainAbilityWhileHere({
//       Name: "Familiar Terrain",
//       Text: "{E} – Deal 2 damage to chosen damaged character or location.",
//       Ability: {
//         Type: "activated",
//         Name: "Familiar Terrain",
//         Text: "{E} , 1 {I} − Deal 2 damage to chosen damaged character",
//         Costs: [{ type: "exert" }, { type: "ink", amount: 1 }],
//         Effects: [
//           {
//             Type: "damage",
//             Amount: 2,
//             Target: {
//               Type: "card",
//               Value: 1,
//               Filters: [
//                 { filter: "type", value: ["character"] },
//                 { filter: "zone", value: "play" },
//                 {
//                   Filter: "status",
//                   Value: "damage",
//                   Comparison: { operator: "gte", value: 1 },
//                 },
//               ],
//             },
//           },
//         ],
//       },
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["emerald"],
//   Cost: 2,
//   Willpower: 7,
//   Illustrator: "Douglas De La Hoz",
//   Number: 101,
//   Set: "SSK",
//   ExternalIds: {
//     TcgPlayer: 559088,
//   },
//   Rarity: "rare",
//   MoveCost: 2,
//   MovementDiscounts: [
//     {
//       Filters: [
//         {
//           Filter: "attribute",
//           Value: "name",
//           Comparison: { operator: "eq", value: "Robin Hood" },
//         },
//       ],
//       Amount: 0,
//     },
//   ],
// };
//
