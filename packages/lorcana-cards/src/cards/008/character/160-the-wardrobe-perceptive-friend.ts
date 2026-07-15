// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { drawXCards } from "@lorcanito/lorcana-engine/effects/effects";
//
// Const iHaveJustTheThing: ActivatedAbility = {
//   Type: "activated",
//   Name: "I HAVE JUST THE THING",
//   Text: "{E}, Choose and discard an item card - Draw 2 cards",
//   Costs: [
//     {
//       Type: "card",
//       Action: "discard",
//       Amount: 1,
//       Filters: [
//         { filter: "type", value: "item" },
//         { filter: "owner", value: "self" },
//         { filter: "zone", value: "hand" },
//       ],
//     },
//     { type: "exert" },
//   ],
//   Effects: [drawXCards(2)],
// };
//
// Export const theWardrobePerceptiveFriend: LorcanitoCharacterCard = {
//   Id: "ogz",
//   Name: "The Wardrobe",
//   Title: "Perceptive Friend",
//   Characteristics: ["storyborn", "ally"],
//   Text: "I HAVE JUST THE THING {E}, Choose and discard an item card - Draw 2 cards",
//   Type: "character",
//   Abilities: [iHaveJustTheThing],
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 4,
//   Strength: 3,
//   Willpower: 4,
//   Illustrator: "Giulia Riva",
//   Number: 160,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631457,
//   },
//   Rarity: "common",
//   Lore: 1,
// };
//
