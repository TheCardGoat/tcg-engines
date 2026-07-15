// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type {
//   DynamicAmount,
//   LorcanitoActionCard,
// } from "@lorcanito/lorcana-engine";
// Import { singerTogetherAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import {
//   DrawXCards,
//   YouGainLore,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// Const singers: DynamicAmount = {
//   Dynamic: true,
//   Filters: [
//     {
//       Filter: "sing",
//       Value: "singer",
//     },
//   ],
// };
//
// Export const fantasticalAndMagical: LorcanitoActionCard = {
//   Id: "h9s",
//   Name: "Fantastical And Magical",
//   Characteristics: ["action", "song"],
//   Text: "Sing Together 9\nFor each character that sang this song, draw a card and gain 1 lore.",
//   Type: "action",
//   Inkwell: false,
//   Colors: ["amethyst"],
//   Cost: 9,
//   Illustrator: "Natalia Trykowska",
//   Number: 79,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631401,
//   },
//   Rarity: "rare",
//   Abilities: [
//     SingerTogetherAbility(9),
//     {
//       Type: "resolution",
//       ResolveAmountBeforeCreatingLayer: true,
//       Effects: [youGainLore(singers), drawXCards(singers)],
//     },
//   ],
// };
//
