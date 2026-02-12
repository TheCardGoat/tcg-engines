// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { duringYourTurnWheneverBanishesItem } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import {
//   BanishChosenItem,
//   YouMayDrawThenChooseAndDiscard,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const archimedesResourcefulOwl: LorcanitoCharacterCard = {
//   Id: "qxe",
//   Name: "Archimedes",
//   Title: "Resourceful Owl",
//   Characteristics: ["storyborn", "ally"],
//   Text: "YOU DON'T NEED THAT When you play this character, you may banish chosen item.\nNOW, THAT'S NOT BAD During your turn, whenever an item is banished, you may draw a card, then choose and discard a card.",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThisCharacter({
//       Name: "YOU DON'T NEED THAT",
//       Text: "When you play this character, you may banish chosen item.",
//       Optional: true,
//       Effects: [banishChosenItem],
//     }),
//     DuringYourTurnWheneverBanishesItem({
//       Name: "NOW, THAT'S NOT BAD",
//       Text: "During your turn, whenever an item is banished, you may draw a card, then choose and discard a card.",
//       Optional: true,
//       ResolveEffectsIndividually: true,
//       ...youMayDrawThenChooseAndDiscard,
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["emerald"],
//   Cost: 3,
//   Strength: 2,
//   Willpower: 2,
//   Illustrator: "Gwawi",
//   Number: 113,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631423,
//   },
//   Rarity: "rare",
//   Lore: 2,
// };
//
