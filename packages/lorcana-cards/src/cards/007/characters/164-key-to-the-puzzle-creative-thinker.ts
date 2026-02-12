// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import {
//   Type ActivatedAbility,
//   WardAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import type { ScryEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// Const scry: ScryEffect = {
//   Type: "scry",
//   Amount: 2,
//   Mode: "inkwell",
//   ShouldRevealTutored: false,
//   Target: self,
//   TutorFilters: [
//     { filter: "owner", value: "self" },
//     { filter: "zone", value: "deck" },
//   ],
//   Limits: {
//     Bottom: 0,
//     Hand: 0,
//     Top: 1,
//     Inkwell: 1,
//   },
// };
//
// Const keyToThePuzzle: ActivatedAbility = {
//   Type: "activated",
//   Name: "KEY TO THE PUZZLE",
//   Text: "{E} – Look at the top 2 cards of your deck. Put one into your inkwell facedown and exerted, and the other on top of your deck.",
//   Costs: [{ type: "exert" }],
//   Effects: [scry],
// };
//
// Export const kidaCreativeThinker: LorcanitoCharacterCard = {
//   Id: "m5r",
//   Name: "Kida",
//   Title: "Creative Thinker",
//   Characteristics: ["storyborn", "hero", "princess"],
//   Text: "Ward\nKEY TO THE PUZZLE {E} – Look at the top 2 cards of your deck. Put one into your inkwell  facedown and exerted, and the other on top of your deck.",
//   Type: "character",
//   Abilities: [wardAbility, keyToThePuzzle],
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 4,
//   Strength: 3,
//   Willpower: 3,
//   Illustrator: "Jennifer Park / Leonardo Giammichele",
//   Number: 164,
//   Set: "007",
//   ExternalIds: {
//     TcgPlayer: 619501,
//   },
//   Rarity: "rare",
//   Lore: 1,
// };
//
