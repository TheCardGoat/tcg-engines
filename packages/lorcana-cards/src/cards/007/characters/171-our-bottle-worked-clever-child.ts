// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { wardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { thisCard } from "@lorcanito/lorcana-engine/abilities/targets";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import type { FilterCondition } from "@lorcanito/lorcana-engine/store/resolvers/conditionResolver";
//
// Const filterCondition: FilterCondition = {
//   Type: "filter",
//   Filters: [
//     { filter: "owner", value: "self" },
//     { filter: "zone", value: "play" },
//     { filter: "type", value: "character" },
//     { filter: "characteristics", value: ["hero"] },
//   ],
//   Comparison: {
//     Operator: "gt",
//     Value: 0,
//   },
// };
// Const ourBottleWorked = {
//   Type: "static",
//   Ability: "gain-ability",
//   Name: "OUR BOTTLE WORKED!",
//   Text: "While you have a Hero character in play, this character gains Ward. (Opponents can't choose them except to challenge.)",
//   Target: thisCard,
//   GainedAbility: wardAbility,
//   Conditions: [filterCondition],
// };
//
// Export const pennyTheOrphanCleverChild: LorcanitoCharacterCard = {
//   Id: "zor",
//   Name: "Penny The Orphan",
//   Title: "Clever Child",
//   Characteristics: ["storyborn", "ally"],
//   Text: "OUR BOTTLE WORKED! While you have a Hero character in play, this character gains Ward. (Opponents can't choose them except to challenge.)",
//   Type: "character",
//   Abilities: [ourBottleWorked],
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 2,
//   Strength: 2,
//   Willpower: 1,
//   Illustrator: "Otto Paredes",
//   Number: 171,
//   Set: "007",
//   ExternalIds: {
//     TcgPlayer: 619504,
//   },
//   Rarity: "common",
//   Lore: 2,
// };
//
