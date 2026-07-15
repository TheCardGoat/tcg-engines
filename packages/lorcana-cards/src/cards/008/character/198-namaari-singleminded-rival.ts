// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { forEachCardInYourDiscard } from "@lorcanito/lorcana-engine/abilities/amounts";
// Import { atTheStartOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
// Import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import {
//   ThisCharacterGetsStrength,
//   YouMayDrawThenChooseAndDiscard,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const namaariSinglemindedRival: LorcanitoCharacterCard = {
//   Id: "l8m",
//   Name: "Namaari",
//   Title: "Single-Minded Rival",
//   Characteristics: ["storyborn", "villain", "princess"],
//   Text: "STRATEGIC EDGE When you play this character and at the start of your turn, you may draw a card, then choose and discard a card.\nEXTREME FOCUS This character gets +1 {S} for each card in your discard.",
//   Type: "character",
//   Abilities: [
//     {
//       Type: "static",
//       Ability: "effects",
//       Name: "EXTREME FOCUS",
//       Text: "This character gets +1 {S} for each card in your discard.",
//       Effects: [thisCharacterGetsStrength(forEachCardInYourDiscard)],
//     },
//     WhenYouPlayThis({
//       ...youMayDrawThenChooseAndDiscard,
//       Name: "STRATEGIC EDGE",
//       Text: "When you play this character and at the start of your turn, you may draw a card, then choose and discard a card.",
//     }),
//     AtTheStartOfYourTurn({
//       ...youMayDrawThenChooseAndDiscard,
//       Name: "STRATEGIC EDGE",
//       Text: "When you play this character and at the start of your turn, you may draw a card, then choose and discard a card.",
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["steel"],
//   Cost: 5,
//   Strength: 0,
//   Willpower: 5,
//   Illustrator: "Max Ulrichney",
//   Number: 198,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631849,
//   },
//   Rarity: "legendary",
//   Lore: 2,
// };
//
