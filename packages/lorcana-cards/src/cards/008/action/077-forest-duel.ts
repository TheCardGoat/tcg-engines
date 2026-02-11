// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type {
//   AbilityEffect,
//   LorcanitoActionCard,
// } from "@lorcanito/lorcana-engine";
// Import { yourCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whenThisCharacterBanishedInAChallenge } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// Const gainsChallenger: AbilityEffect = {
//   Type: "ability",
//   Ability: "challenger",
//   Amount: 2,
//   Modifier: "add",
//   Duration: "turn",
//   Target: yourCharacters,
// };
//
// Const gainsReturnToHand: AbilityEffect = {
//   Type: "ability",
//   Ability: "custom",
//   Modifier: "add",
//   Duration: "turn",
//   CustomAbility: whenThisCharacterBanishedInAChallenge({
//     Effects: [
//       {
//         Type: "move",
//         To: "hand",
//         Target: {
//           Type: "card",
//           Value: "all",
//           Filters: [{ filter: "source", value: "self" }],
//         },
//       },
//     ],
//   }),
//   Target: yourCharacters,
// };
//
// Export const forestDuel: LorcanitoActionCard = {
//   Id: "m3x",
//   Name: "Forest Duel",
//   Characteristics: ["action"],
//   Text: "Your characters gain Challenger +2 and 'When this character is banished in a challenge, return this card to your hand' this turn.",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Effects: [gainsChallenger, gainsReturnToHand],
//     },
//   ],
//   Inkwell: true,
//   Colors: ["amethyst"],
//   Cost: 5,
//   Illustrator: "Yr Tanner",
//   Number: 77,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631343,
//   },
//   Rarity: "uncommon",
// };
//
