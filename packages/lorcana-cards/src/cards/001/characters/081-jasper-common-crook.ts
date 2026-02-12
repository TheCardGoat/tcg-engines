import type { CharacterCard } from "@tcg/lorcana-types";

export const jasperCommonCrook: CharacterCard = {
  abilities: [],
  cardNumber: 81,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Jasper - Common Crook",
  id: "agw",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  name: "Jasper",
  set: "001",
  strength: 2,
  text: "**PUPPYNAPPING** Whenever this character quests, chosen opposing character can",
  version: "Common Crook",
  willpower: 4,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const jasperCommonCrook: LorcanitoCharacterCard = {
//   Id: "agw",
//   Name: "Jasper",
//   Title: "Common Crook",
//   Characteristics: ["storyborn", "ally"],
//   Text: "**PUPPYNAPPING** Whenever this character quests, chosen opposing character can't quest during their next turn.",
//   Type: "character",
//   Abilities: [
//     WheneverQuests({
//       Name: "Puppynapping",
//       Text: "Whenever this character quests, chosen opposing character can't quest during their next turn.",
//       Effects: [
//         {
//           Type: "restriction",
//           Restriction: "quest",
//           Duration: "next_turn",
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "opponent" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   Flavour: "Now, look here, Horace, I warned you about thinkin.",
//   Inkwell: true,
//   Colors: ["emerald"],
//   Cost: 3,
//   Strength: 2,
//   Willpower: 4,
//   Lore: 1,
//   Illustrator: "Jochem Van Gool",
//   Number: 81,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 507498,
//   },
//   Rarity: "uncommon",
// };
//
