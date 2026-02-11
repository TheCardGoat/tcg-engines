import type { CharacterCard } from "@tcg/lorcana-types";

export const mauriceWorldfamousInventor: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      id: "v0e-1",
      text: "**GIVE IT A TRY** Whenever this character quests, you pay 2 {I} less for the next item you play this turn.\n\n**IT WORKS!** Whenever you play an item, you may draw a card.",
      type: "action",
    },
  ],
  cardNumber: 152,
  cardType: "character",
  classifications: ["Dreamborn", "Inventor", "Mentor"],
  cost: 6,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Maurice - World-Famous Inventor",
  id: "v0e",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  name: "Maurice",
  set: "001",
  strength: 2,
  text: "**GIVE IT A TRY** Whenever this character quests, you pay 2 {I} less for the next item you play this turn.\n\n**IT WORKS!** Whenever you play an item, you may draw a card.",
  version: "World-Famous Inventor",
  willpower: 7,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import {
//   WheneverPlays,
//   WheneverQuests,
// } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const mauriceWorldFamousInventor: LorcanitoCharacterCard = {
//   Id: "v0e",
//
//   Name: "Maurice",
//   Title: "World-Famous Inventor",
//   Characteristics: ["dreamborn", "inventor", "mentor"],
//   Text: "**GIVE IT A TRY** Whenever this character quests, you pay 2 {I} less for the next item you play this turn.\n\n**IT WORKS!** Whenever you play an item, you may draw a card.",
//   Type: "character",
//   Abilities: [
//     WheneverQuests({
//       Name: "Give it a try",
//       Text: "Whenever this character quests, you pay 2 {I} less for the next item you play this turn.",
//       Effects: [
//         {
//           Type: "replacement",
//           Replacement: "cost",
//           Duration: "next",
//           Amount: 2,
//           Target: {
//             Type: "card",
//             Value: "all",
//             Filters: [{ filter: "type", value: "item" }],
//           },
//         },
//       ],
//     }),
//     WheneverPlays({
//       TriggerTarget: {
//         Type: "card",
//         Value: 1,
//         Filters: [
//           { filter: "type", value: "item" },
//           { filter: "owner", value: "self" },
//         ],
//       },
//       Optional: true,
//       Effects: [
//         {
//           Type: "draw",
//           Amount: 1,
//           Target: {
//             Type: "player",
//             Value: "self",
//           },
//         },
//       ],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 6,
//   Strength: 2,
//   Willpower: 7,
//   Lore: 2,
//   Illustrator: "Alex Accorsi",
//   Number: 152,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 492126,
//   },
//   Rarity: "rare",
// };
//
