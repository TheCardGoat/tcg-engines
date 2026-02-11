import type { ActionCard } from "@tcg/lorcana-types";

export const grabYourSword: ActionCard = {
  abilities: [
    {
      effect: {
        type: "deal-damage",
        amount: 2,
        target: "ALL_OPPOSING_CHARACTERS",
      },
      id: "fa7-1",
      text: "Deal 2 damage to each opposing character.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 198,
  cardType: "action",
  cost: 5,
  externalIds: {
    ravensburger: "371502073092025bab3c49038c7809151c636ad4",
  },
  franchise: "Beauty and the Beast",
  id: "fa7",
  inkType: ["steel"],
  inkable: false,
  name: "Grab Your Sword",
  set: "001",
  text: "Deal 2 damage to each opposing character.",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const grabYourSword: LorcanitoActionCard = {
//   Id: "u4k",
//   Name: "Grab Your Sword",
//   Characteristics: ["action", "song"],
//   Text: "_(A character with cost 5 or more can {E} to sing this song for free.)_\nDeal 2 damage to each opposing character.",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Name: "Grab Your Sword",
//       Text: "Deal 2 damage to each opposing character.",
//       Effects: [
//         {
//           Type: "damage",
//           Amount: 2,
//           Target: {
//             Type: "card",
//             Value: "all",
//             Filters: [
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "opponent" },
//               { filter: "type", value: "character" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   Flavour: "We don't like\nwhat we don't understand\nIn fact, it scares us",
//   Colors: ["steel"],
//   Cost: 5,
//   Illustrator: "Peter Brockhammer",
//   Number: 198,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 503469,
//   },
//   Rarity: "rare",
// };
//
