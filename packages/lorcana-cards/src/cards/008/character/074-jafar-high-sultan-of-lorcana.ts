// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type {
//   CardEffectTarget,
//   LorcanitoCharacterCard,
// } from "@lorcanito/lorcana-engine";
// Import { parentsTarget } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { wheneverThisCharacterQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import {
//   DiscardACard,
//   DrawACard,
// } from "@lorcanito/lorcana-engine/effects/effects";
// Import type { CreateLayerBasedOnTarget } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// Const illusionCharacter: CardEffectTarget = {
//   Type: "card",
//   Value: "all",
//   Filters: [
//     { filter: "type", value: "character" },
//     { filter: "characteristics", value: ["illusion"] },
//     { filter: "owner", value: "self" },
//   ],
// };
//
// Const ifItsAnIllusionCardPlayForFree: CreateLayerBasedOnTarget = {
//   Type: "create-layer-based-on-target",
//   // TODO: get rid of target
//   Target: {} as CardEffectTarget, // unused by the code logic
//   Filters: illusionCharacter.filters,
//   NumberOfMatchingTargets: { operator: "eq", value: 1 },
//   Effects: [
//     {
//       Type: "play",
//       ForFree: true,
//       Target: parentsTarget,
//     },
//   ],
// };
//
// Export const jafarHighSultanOfLorcana: LorcanitoCharacterCard = {
//   Id: "lqa",
//   Name: "Jafar",
//   Title: "High Sultan of Lorcana",
//   Characteristics: ["dreamborn", "villain", "king", "sorcerer"],
//   Text: "DARK POWER Whenever this character quests, you may draw a card, then choose and discard a card. If an Illusion character card is discarded this way, you may play that character for free.",
//   Type: "character",
//   Abilities: [
//     WheneverThisCharacterQuests({
//       Name: "DARK POWER",
//       Text: "Whenever this character quests, you may draw a card, then choose and discard a card. If an Illusion character card is discarded this way, you may play that character for free.",
//       Optional: true,
//       ResolveEffectsIndividually: true,
//       Effects: [
//         DrawACard,
//         {
//           ...discardACard,
//           AfterEffect: [ifItsAnIllusionCardPlayForFree],
//         },
//       ],
//     }),
//   ],
//   Inkwell: false,
//   Colors: ["amethyst", "steel"],
//   Cost: 5,
//   Strength: 4,
//   Willpower: 4,
//   Illustrator: "Cristian Romero",
//   Number: 74,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631400,
//   },
//   Rarity: "super_rare",
//   Lore: 3,
// };
//
