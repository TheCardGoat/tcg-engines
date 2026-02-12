import type { ActionCard } from "@tcg/lorcana-types";

export const fanTheFlames: ActionCard = {
  abilities: [
    {
      effect: {
        type: "restriction",
        restriction: "cant-quest",
        target: "SELF",
      },
      id: "1eo-1",
      text: "Ready chosen character. They can't quest for the rest of this turn.",
      type: "static",
    },
  ],
  cardNumber: 131,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "b6ae49eb443bf7dcdbb8754463b0144b3c7c183e",
  },
  franchise: "Beauty and the Beast",
  id: "1eo",
  inkType: ["ruby"],
  inkable: true,
  name: "Fan the Flames",
  set: "001",
  text: "Ready chosen character. They can't quest for the rest of this turn.",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const fanTheFlames: LorcanitoActionCard = {
//   Id: "afx",
//   Name: "Fan The Flames",
//   Characteristics: ["action"],
//   Text: "Ready chosen character. They can't quest for the rest of this turn.",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Name: "Fan The Flames",
//       Text: "Ready chosen character. They can't quest for the rest of this turn.",
//       Effects: readyAndCantQuest({
//         Type: "card",
//         Value: 1,
//         Filters: [
//           { filter: "type", value: "character" },
//           { filter: "zone", value: "play" },
//         ],
//       }),
//     },
//   ],
//   Flavour: "Pretty words can move a crowd, but so can ugly ones.",
//   Inkwell: true,
//   Colors: ["ruby"],
//   Cost: 1,
//   Illustrator: "Jenna Gray",
//   Number: 131,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 505992,
//   },
//   Rarity: "uncommon",
// };
//
