// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// Import {
//   ChallengerAbility,
//   YourCharactersNamedGain,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { wheneverOpposingCharIsBanishedInChallenge } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const captainHooksRapier: LorcanitoItemCard = {
//   Id: "wmj",
//   MissingTestCase: true,
//   Name: "Captain Hook's Rapier",
//   Characteristics: ["item"],
//   Text: "**GET THOSE SCURVY BRATS!** During your turn, whenever one of your characters banishes another character in a challenge, you may pay 1 {I} to draw a card.\n\n\n**LET'S HAVE AT IT!</** Your characters named Captain Hook gain **Challenger** +1. _(They get +1 {S} while challenging.)_",
//   Type: "item",
//   Abilities: [
//     WheneverOpposingCharIsBanishedInChallenge({
//       Name: "Get Those Scurvy Brats!",
//       Text: "During your turn, whenever one of your characters banishes another character in a challenge, you may pay 1 {I} to draw a card.",
//       Optional: true,
//       Costs: [{ type: "ink", amount: 1 }],
//       Effects: [drawACard],
//     }),
//     YourCharactersNamedGain({
//       Name: "Captain Hook",
//       Ability: challengerAbility(1),
//       ExcludeSelf: true,
//     }),
//   ],
//   Colors: ["steel"],
//   Cost: 3,
//   Illustrator: "Jeremy Adams",
//   Number: 199,
//   Set: "ITI",
//   ExternalIds: {
//     TcgPlayer: 537759,
//   },
//   Rarity: "uncommon",
// };
//
