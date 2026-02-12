import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseWaywardSorcerer: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["card"],
          },
        },
        chooser: "CONTROLLER",
      },
      id: "kuw-1",
      text: "**CEASELESS WORKER** Whenever one of your Broom characters is banished in a challenge, you may return that card to your hand.",
      type: "action",
    },
  ],
  cardNumber: 51,
  cardType: "character",
  classifications: ["Dreamborn", "Sorcerer"],
  cost: 4,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Mickey Mouse - Wayward Sorcerer",
  id: "kuw",
  inkType: ["amethyst"],
  inkable: true,
  lore: 2,
  name: "Mickey Mouse",
  set: "001",
  strength: 3,
  text: "**ANIMATE BROOM** You pay 1 {I} less to play Broom characters.\n\n**CEASELESS WORKER** Whenever one of your Broom characters is banished in a challenge, you may return that card to your hand.",
  version: "Wayward Sorcerer",
  willpower: 4,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { wheneverOneOfYourCharactersIsBanishedInAChallenge } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const mickeyMouseWaywardSorcerer: LorcanitoCharacterCard = {
//   Id: "kuw",
//
//   Name: "Mickey Mouse",
//   Title: "Wayward Sorcerer",
//   Characteristics: ["dreamborn", "sorcerer"],
//   Text: "**ANIMATE BROOM** You pay 1 {I} less to play Broom characters.\n\n**CEASELESS WORKER** Whenever one of your Broom characters is banished in a challenge, you may return that card to your hand.",
//   Type: "character",
//   Abilities: [
//     {
//       Type: "static",
//       Name: "Animate Broom",
//       Text: "You pay 1 {I} less to play Broom characters.",
//       Ability: "effects",
//       Effects: [
//         {
//           Type: "replacement",
//           Replacement: "cost",
//           Duration: "static",
//           Amount: 1,
//           Target: {
//             Type: "card",
//             Value: "all",
//             Filters: [
//               { filter: "type", value: "character" },
//               { filter: "characteristics", value: ["broom"] },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     },
//     WheneverOneOfYourCharactersIsBanishedInAChallenge({
//       Name: "Ceaseless Worker",
//       Text: "Whenever one of your Broom characters is banished in a challenge, you may return that card to your hand.",
//       Optional: true,
//       TriggerFilter: [
//         { filter: "owner", value: "self" },
//         { filter: "type", value: "character" },
//         { filter: "characteristics", value: ["broom"] },
//       ],
//       Effects: [
//         {
//           Type: "move",
//           To: "hand",
//           Target: {
//             Type: "card",
//             Value: "all",
//             Filters: [{ filter: "source", value: "trigger" }],
//           },
//         },
//       ],
//     }),
//   ],
//   Flavour: "He always goes for the clean sweep.",
//   Inkwell: true,
//   Colors: ["amethyst"],
//   Cost: 4,
//   Strength: 3,
//   Willpower: 4,
//   Lore: 2,
//   Illustrator: "Nicholas Kole",
//   Number: 51,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 492369,
//   },
//   Rarity: "super_rare",
// };
//
