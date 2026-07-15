// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { wheneverIsReturnedToHand } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
// Import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
//
// Const racerCharacterInDiscard: CardEffectTarget = {
//   Type: "card",
//   Value: 1,
//   ExcludeSelf: true,
//   Filters: [
//     { filter: "owner", value: "self" },
//     { filter: "type", value: "character" },
//     { filter: "characteristics", value: ["racer"] },
//     { filter: "zone", value: "discard" },
//   ],
// };
//
// Const racerCharacterInPlay: CardEffectTarget = {
//   Type: "card",
//   Value: 1,
//   ExcludeSelf: true,
//   Filters: [
//     { filter: "owner", value: "self" },
//     { filter: "type", value: "character" },
//     { filter: "characteristics", value: ["racer"] },
//     { filter: "zone", value: "play" },
//   ],
// };
//
// Export const fixitFelixJrPintsizedHero: LorcanitoCharacterCard = {
//   Id: "vw2",
//   Name: "Fix‐It Felix, Jr.",
//   Title: "Pint‐Sized Hero",
//   Characteristics: ["storyborn", "hero", "racer"],
//   Type: "character",
//   Inkwell: true,
//   Colors: ["amber", "ruby"],
//   Cost: 5,
//   Strength: 4,
//   Willpower: 4,
//   Illustrator: "Stefano Spagnuolo",
//   Number: 22,
//   Set: "007",
//   ExternalIds: {
//     TcgPlayer: 619417,
//   },
//   Rarity: "uncommon",
//   Lore: 2,
//   Text: "LET'S GET TO WORK Whenever you return a Racer character card from your discard to your hand, you may ready chosen Racer character. They can't quest for the rest of this turn.",
//   Abilities: [
//     WheneverIsReturnedToHand({
//       Name: "LET'S GET TO WORK",
//       Text: "Whenever you return a Racer character card from your discard to your hand, you may ready chosen Racer character. They can't quest for the rest of this turn.",
//       Optional: true,
//       Target: racerCharacterInDiscard,
//       Effects: readyAndCantQuest(racerCharacterInPlay),
//     }),
//   ],
// };
//
