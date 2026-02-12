// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type {
//   MetaAbility,
//   ResolutionAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { readyItemsYouControl } from "@lorcanito/lorcana-engine/abilities/target";
// Import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Const fortuneHunterAbility: ResolutionAbility = {
//   Type: "resolution",
//   Name: "FORTUNE HUNTER",
//   Text: "When you play this character, look at the top 4 cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.",
//   Effects: [
//     {
//       Type: "scry",
//       Amount: 4,
//       Mode: "bottom",
//       ShouldRevealTutored: true,
//       Target: self,
//       Limits: {
//         Bottom: 4,
//         Top: 0,
//         Hand: 1,
//         Inkwell: 0,
//       },
//       TutorFilters: [
//         { filter: "owner", value: "self" },
//         { filter: "zone", value: "deck" },
//         { filter: "type", value: "item" },
//       ],
//     },
//   ],
// };
//
// Const putItToGoodUse: MetaAbility = {
//   Type: "static",
//   Ability: "meta",
//   Name: "PUT IT TO GOOD USE",
//   Text: "You may exert 4 items of yours to play this character for free.",
//   AlternativeCosts: [
//     {
//       Type: "card",
//       Action: "exert",
//       Amount: 4,
//       Filters: readyItemsYouControl,
//     },
//   ],
// };
//
// Export const scroogeMcduckResourcefulMiser: LorcanitoCharacterCard = {
//   Id: "z1q",
//   Name: "Scrooge Mcduck",
//   Title: "Resourceful Miser",
//   Characteristics: ["storyborn", "hero"],
//   Text: "PUT IT TO GOOD USE You may exert 4 items of yours to play this character for free.\nFORTUNE HUNTER When you play this character, look at the top 4 cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.",
//   Type: "character",
//   Abilities: [putItToGoodUse, fortuneHunterAbility],
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 4,
//   Strength: 4,
//   Willpower: 4,
//   Illustrator: "Kenneth Anderson",
//   Number: 154,
//   Set: "007",
//   ExternalIds: {
//     TcgPlayer: 618202,
//   },
//   Rarity: "legendary",
//   Lore: 1,
// };
//
