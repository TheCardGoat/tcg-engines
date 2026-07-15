// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import {
//   ShiftAbility,
//   SupportAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { ifYouHaveCharacterNamed } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// Import { wheneverThisCharacterQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const annaMagicalMission: LorcanitoCharacterCard = {
//   Id: "uvp",
//   Name: "Anna",
//   Title: "Magical Mission",
//   Characteristics: ["floodborn", "hero", "queen", "sorcerer"],
//   Text: "Shift 4 \nSupport \nCOORDINATED PLAN Whenever this character quests, if you have a character named Elsa in play, you may draw a card.",
//   Type: "character",
//   Abilities: [
//     ShiftAbility(4, "Anna"),
//     SupportAbility,
//     WheneverThisCharacterQuests({
//       Name: "COORDINATED PLAN",
//       Text: "Whenever this character quests, if you have a character named Elsa in play, you may draw a card.",
//       Optional: true,
//       Conditions: [ifYouHaveCharacterNamed(["Elsa"])],
//       Effects: [drawACard],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["amethyst", "sapphire"],
//   Cost: 6,
//   Strength: 3,
//   Willpower: 6,
//   Illustrator: "Luigi Aimè",
//   Number: 72,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631399,
//   },
//   Rarity: "rare",
//   Lore: 2,
// };
//
