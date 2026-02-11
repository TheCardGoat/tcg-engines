// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// Import { wheneverACardIsPutIntoYourInkwell } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
//
// Const chosenPrincessCharacterOfYours: CardEffectTarget = {
//   Type: "card",
//   Value: 1,
//   Filters: [
//     { filter: "type", value: "character" },
//     { filter: "zone", value: "play" },
//     { filter: "owner", value: "self" },
//     { filter: "characteristics", value: ["princess"] },
//   ],
// };
//
// Const fairyGodmothersWandAbility = wheneverACardIsPutIntoYourInkwell({
//   Name: "Only Till Midnight",
//   Text: "During your turn, whenever you put a card into your inkwell, chosen Princess character of yours gains Ward until the start of your next turn. (Opponents can't choose them except to challenge.)",
//   Optional: true,
//   Conditions: [{ type: "during-turn", value: "self" }],
//   Effects: [
//     {
//       Type: "ability",
//       Ability: "ward",
//       Duration: "next_turn",
//       Until: true,
//       Modifier: "add",
//       Target: chosenPrincessCharacterOfYours,
//     },
//   ],
// });
//
// Export const fairyGodmothersWand: LorcanitoItemCard = {
//   Id: "vw5",
//   Name: "Fairy Godmother's Wand",
//   Characteristics: ["item"],
//   Text: "ONLY TILL MIDNIGHT During your turn, whenever you put a card into your inkwell, chosen Princess character of yours gains Ward until the start of your next turn. (Opponents can't choose them except to challenge.)",
//   Type: "item",
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 2,
//   Illustrator: "Aurélie Lise-Anne",
//   Number: 168,
//   Set: "010",
//   ExternalIds: {
//     TcgPlayer: 658786,
//   },
//   Rarity: "super_rare",
//   Abilities: [fairyGodmothersWandAbility],
// };
//
