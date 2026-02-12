import type { ActionCard } from "@tcg/lorcana-types";

export const bePrepared: ActionCard = {
  abilities: [
    {
      effect: {
        type: "banish",
        target: "ALL_CHARACTERS",
      },
      id: "j9z-1",
      text: "Banish all characters.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 128,
  cardType: "action",
  cost: 7,
  externalIds: {
    ravensburger: "4579dd841c902f1f7a336b3776c97a974e5f3369",
  },
  franchise: "Lion King",
  id: "j9z",
  inkType: ["ruby"],
  inkable: false,
  name: "Be Prepared",
  set: "001",
  text: "Banish all characters.",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const bePrepared: LorcanitoActionCard = {
//   Id: "z06",
//   Name: "Be Prepared",
//   Characteristics: ["action", "song"],
//   Text: "_(A character with cost 7 or more can {E} to sing this\nsong for free.)_\nBanish all characters.",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Name: "Be Prepared",
//       Text: "Banish all characters.",
//       Effects: [
//         {
//           Type: "banish",
//           Target: {
//             Type: "card",
//             Value: "all",
//             Filters: [
//               { filter: "zone", value: "play" },
//               { filter: "type", value: "character" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   Flavour: "Out teeth and ambitions are bared!",
//   Colors: ["ruby"],
//   Cost: 7,
//   Illustrator: "Jared Nickerl",
//   Number: 128,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 506077,
//   },
//   Rarity: "rare",
// };
//
