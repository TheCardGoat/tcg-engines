// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
// Import type { RevealFromTopUntilCardEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// Const floodBornCharInYourDeck: CardEffectTarget = {
//   Type: "card",
//   Value: "all",
//   Filters: [
//     { filter: "type", value: "character" },
//     { filter: "characteristics", value: ["floodborn"] },
//   ],
// };
//
// Const revealTopCardEffect: RevealFromTopUntilCardEffect = {
//   Type: "reveal-from-top-until",
//   Target: floodBornCharInYourDeck,
//   OnTargetMatchEffects: [
//     {
//       Type: "create-layer-based-on-target",
//       Filters: floodBornCharInYourDeck.filters,
//       // TODO: get rid of target
//       Target: floodBornCharInYourDeck,
//       Effects: [
//         {
//           Type: "move",
//           To: "hand",
//           Target: floodBornCharInYourDeck,
//         },
//       ],
//     },
//   ],
// };
//
// Export const fredGiantsized: LorcanitoCharacterCard = {
//   Id: "fgp",
//   Name: "Fred",
//   Title: "Giant-Sized",
//   Characteristics: ["floodborn", "hero"],
//   Text: "Shift 5\n\nI LIKE WHERE THIS IS HEADING Whenever this character quests, reveal cards from the top of your deck until you reveal a Floodborn character card. Put that card into your hand and shuffle the rest into your deck.",
//   Type: "character",
//   Abilities: [
//     ShiftAbility(5, "Fred"),
//     WheneverQuests({
//       Name: "I LIKE WHERE THIS IS HEADING",
//       Text: "Whenever this character quests, reveal cards from the top of your deck until you reveal a Floodborn character card. Put that card into your hand and shuffle the rest into your deck.",
//       Effects: [
//         RevealTopCardEffect,
//         {
//           Type: "shuffle-deck",
//           Target: self,
//         },
//       ],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["emerald"],
//   Cost: 7,
//   Strength: 5,
//   Willpower: 6,
//   Illustrator: "Jules Dubost",
//   Number: 98,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 632710,
//   },
//   Rarity: "rare",
//   Lore: 3,
// };
//
