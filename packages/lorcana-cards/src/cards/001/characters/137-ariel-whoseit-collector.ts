import type { CharacterCard } from "@tcg/lorcana-types";

export const arielWhoseitCollector: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "ready",
          target: {
            selector: "self",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        type: "optional",
      },
      id: "c6b-1",
      text: "**PRINCE'S CHARM** You may ready this character.",
      type: "action",
    },
  ],
  cardNumber: 137,
  cardType: "character",
  classifications: ["Hero", "Storyborn", "Princess"],
  cost: 4,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Ariel - Whoseit Collector",
  id: "df2",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  name: "Ariel",
  set: "001",
  strength: 3,
  text: "**LOOK AT THIS STUFF** Whenever you play an item, you may ready this character.",
  version: "Whoseit Collector",
  willpower: 3,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { wheneverPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const arielWhoseitCollector: LorcanitoCharacterCard = {
//   Id: "df2",
//   Name: "Ariel",
//   Title: "Whoseit Collector",
//   Characteristics: ["hero", "storyborn", "princess"],
//   Text: "**LOOK AT THIS STUFF** Whenever you play an item, you may ready this character.",
//   Type: "character",
//   Abilities: [
//     WheneverPlays({
//       Name: "Look at This Stuff",
//       Text: "Whenever you play an item, you may ready this character.",
//       Optional: true,
//       TriggerTarget: {
//         Type: "card",
//         Value: 1,
//         Filters: [
//           { filter: "type", value: "item" },
//           { filter: "owner", value: "self" },
//         ],
//       },
//       Effects: [
//         {
//           Type: "exert",
//           Exert: false,
//           Target: {
//             Type: "card",
//             Value: "all",
//             Filters: [{ filter: "source", value: "self" }],
//           },
//         },
//       ],
//     }),
//   ],
//   Flavour: "You want thingamabobs? I got twenty.",
//   Colors: ["sapphire"],
//   Cost: 4,
//   Strength: 3,
//   Willpower: 3,
//   Lore: 1,
//   Illustrator: "Hedvig Häggman-Sund",
//   Number: 137,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 502532,
//   },
//   Rarity: "rare",
// };
//
