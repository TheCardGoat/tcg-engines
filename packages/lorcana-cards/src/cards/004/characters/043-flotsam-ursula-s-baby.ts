// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { whenThisCharacterBanishedInAChallenge } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import { returnThisCardToHand } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const flotsamUrsulasBaby: LorcanitoCharacterCard = {
//   Id: "ha8",
//   MissingTestCase: true,
//   Name: "Flotsam",
//   Title: 'Ursula\'s "Baby"',
//   Characteristics: ["dreamborn", "ally"],
//   Text: '**QUICK ESCAPE** When this character is banished in a challenge, return this card to your hand.\n\n\n**OMINOUS PAIR** Your characters named Jetsam gain "When this character is banished in a challenge, return this card to your hand."',
//   Type: "character",
//   Abilities: [
//     WhenThisCharacterBanishedInAChallenge({
//       Name: "Quick Escape",
//       Text: "When this character is banished in a challenge, return this card to your hand.",
//       Effects: [returnThisCardToHand],
//     }),
//     {
//       Type: "static",
//       Ability: "gain-ability",
//       Name: "Quick Escape",
//       Text: "When this character is banished in a challenge, return this card to your hand.",
//       GainedAbility: whenThisCharacterBanishedInAChallenge({
//         Name: "Quick Escape",
//         Text: "When this character is banished in a challenge, return this card to your hand.",
//         Effects: [returnThisCardToHand],
//       }),
//       Target: {
//         Type: "card",
//         Value: "all",
//         ExcludeSelf: true,
//         Filters: [
//           { filter: "owner", value: "self" },
//           { filter: "type", value: "character" },
//           { filter: "zone", value: "play" },
//           {
//             Filter: "attribute",
//             Value: "name",
//             Comparison: { operator: "eq", value: "Jetsam" },
//           },
//         ],
//       },
//     },
//   ],
//   Flavour: "Now the crown <b>and</b> the trident are mine! −Ursula",
//   Colors: ["amethyst"],
//   Cost: 3,
//   Strength: 4,
//   Willpower: 2,
//   Lore: 1,
//   Illustrator: "Brian Kesinger",
//   Number: 43,
//   Set: "URR",
//   ExternalIds: {
//     TcgPlayer: 549467,
//   },
//   Rarity: "uncommon",
// };
//
