import type { ActionCard } from "@tcg/lorcana-types";

export const fireTheCannonsundefined: ActionCard = {
  abilities: [
    {
      effect: {
        amount: 2,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "deal-damage",
      },
      id: "lhl-1",
      text: "Deal 2 damage to chosen character.",
      type: "action",
    },
  ],
  cardNumber: 197,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Fire the Cannons! - undefined",
  id: "lhl",
  inkType: ["steel"],
  inkable: true,
  name: "Fire the Cannons!",
  set: "001",
  text: "Deal 2 damage to chosen character.",
  version: "undefined",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const fireTheCannons: LorcanitoActionCard = {
//   Id: "lhl",
//   Reprints: ["ooh"],
//   Name: "Fire the Cannons!",
//   Characteristics: ["action"],
//   Text: "Deal 2 damage to chosen character.",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Name: "Fire the Cannons!",
//       Text: "Deal 2 damage to chosen character.",
//       Effects: [
//         {
//           Type: "damage",
//           Amount: 2,
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   Flavour:
//     "Captain Hook: „Double the powder and shorten the\rfuse!<br />Mr. Smee: „Shorten the powder and double the fuse!",
//   Colors: ["steel"],
//   Cost: 1,
//   Illustrator: "Matt Chapman",
//   Number: 197,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 493483,
//   },
//   Rarity: "common",
// };
//
