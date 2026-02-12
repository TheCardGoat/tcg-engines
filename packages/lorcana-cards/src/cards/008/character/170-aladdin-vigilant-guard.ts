// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { bodyguardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// Export const aladdinVigilantGuard: LorcanitoCharacterCard = {
//   Id: "fg9",
//   Name: "Aladdin",
//   Title: "Vigilant Guard",
//   Characteristics: ["dreamborn", "hero", "prince"],
//   Text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nSAFE PASSAGE Whenever one of your Ally characters quests, you may remove up to 2 damage from this character.",
//   Type: "character",
//   Abilities: [
//     BodyguardAbility,
//     WheneverQuests({
//       Name: "SAFE PASSAGE",
//       Text: "Whenever one of your Ally characters quests, you may remove up to 2 damage from this character.",
//       Optional: true,
//       TriggerTarget: {
//         Type: "card",
//         Value: "all",
//         Filters: [
//           { filter: "type", value: "character" },
//           { filter: "characteristics", value: ["ally"] },
//           { filter: "owner", value: "self" },
//           { filter: "zone", value: "play" },
//         ],
//       },
//       Effects: [
//         {
//           Type: "heal",
//           Amount: 2,
//           UpTo: true,
//           Target: thisCharacter,
//         },
//       ],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["sapphire", "steel"],
//   Cost: 6,
//   Strength: 1,
//   Willpower: 9,
//   Illustrator: "Marcel Berg",
//   Number: 170,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631466,
//   },
//   Rarity: "rare",
//   Lore: 1,
// };
//
