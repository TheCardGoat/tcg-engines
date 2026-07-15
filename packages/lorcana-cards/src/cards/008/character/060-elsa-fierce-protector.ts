// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { exertChosenOpposingCharacter } from "@lorcanito/lorcana-engine/effects/effects";
//
// Const iceOver: ActivatedAbility = {
//   Type: "activated",
//   Name: "ICE OVER",
//   Text: "1 {I}, Choose and discard a card – Exert chosen opposing character.",
//   Optional: false,
//   Costs: [
//     { type: "ink", amount: 1 },
//     {
//       Type: "card",
//       Action: "discard",
//       Amount: 1,
//       Filters: [
//         { filter: "zone", value: "hand" },
//         { filter: "owner", value: "self" },
//       ],
//     },
//   ],
//   Effects: [exertChosenOpposingCharacter],
// };
//
// Export const elsaFierceProtector: LorcanitoCharacterCard = {
//   Id: "wd1",
//   Name: "Elsa",
//   Title: "Fierce Protector",
//   Characteristics: ["storyborn", "hero", "queen", "sorcerer"],
//   Text: "ICE OVER 1 {I}, Choose and discard a card – Exert chosen opposing character.",
//   Type: "character",
//   Abilities: [iceOver],
//   Inkwell: true,
//   Colors: ["amethyst"],
//   Cost: 4,
//   Strength: 3,
//   Willpower: 4,
//   Illustrator: "Hedvig H S",
//   Number: 60,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631391,
//   },
//   Rarity: "rare",
//   Lore: 1,
// };
//
