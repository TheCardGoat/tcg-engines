// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// Import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import { chosenCharacterGainsRush } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const mushusRocket: LorcanitoItemCard = {
//   Id: "z0q",
//   Name: "Mushu's Rocket",
//   Characteristics: ["item"],
//   Text: "I NEED FIREPOWER When you play this item, chosen character gains Rush this turn. (They can challenge the turn they're played.)\nHITCH A RIDE 2 {I}, Banish this item — Chosen character gains Rush this turn.",
//   Type: "item",
//   Inkwell: true,
//   Colors: ["ruby"],
//   Cost: 1,
//   Illustrator: "Brooks Eggleston",
//   Number: 134,
//   Set: "010",
//   ExternalIds: {
//     TcgPlayer: 659423,
//   },
//   Rarity: "uncommon",
//   Abilities: [
//     // I NEED FIREPOWER - When you play this item, chosen character gains Rush this turn
//     WhenYouPlayThis({
//       Name: "I NEED FIREPOWER",
//       Text: "When you play this item, chosen character gains Rush this turn. (They can challenge the turn they're played.)",
//       Effects: [chosenCharacterGainsRush],
//       Target: chosenCharacter,
//     }),
//     // HITCH A RIDE - 2 {I}, Banish this item — Chosen character gains Rush this turn
//     {
//       Type: "activated",
//       Name: "HITCH A RIDE",
//       Text: "2 {I}, Banish this item — Chosen character gains Rush this turn.",
//       Costs: [{ type: "ink", amount: 2 }, { type: "banish" }],
//       Effects: [chosenCharacterGainsRush],
//     },
//   ],
// };
//
