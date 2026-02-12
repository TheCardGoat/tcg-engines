// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import {
//   Type ActivatedAbility,
//   RushAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { allCardsInYourDeck } from "@lorcanito/lorcana-engine/abilities/amounts";
// Import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const fullBreachAndMoneyEverywhereCombo: ActivatedAbility = {
//   Type: "activated",
//   Name: "FULL BREACH + COMBO",
//   Text: "Draw your whole deck, discard that many cards.",
//   Optional: false,
//   ResolveEffectsIndividually: true,
//   ResolveAmountBeforeCreatingLayer: true,
//   Costs: [],
//   Effects: [
//     {
//       Type: "draw",
//       Amount: allCardsInYourDeck,
//       Target: self,
//     },
//     {
//       Type: "discard",
//       Amount: allCardsInYourDeck,
//       Target: {
//         Type: "card",
//         Value: allCardsInYourDeck,
//         Filters: [
//           { filter: "zone", value: "hand" },
//           { filter: "owner", value: "self" },
//         ],
//       },
//     },
//   ],
// };
//
// Export const fullBreach: ActivatedAbility = {
//   Type: "activated",
//   Name: "FULL BREACH",
//   Text: "Choose and discard a card - Ready this character. He can't quest for the rest of this turn.",
//   Optional: false,
//   Costs: [
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
//   Effects: [
//     ...readyAndCantQuest(
//       {
//         Type: "card",
//         Value: "all",
//         Filters: [{ filter: "source", value: "self" }],
//       },
//       True,
//     ),
//   ],
// };
//
// Export const monstroInfamousWhale: LorcanitoCharacterCard = {
//   Id: "oa8",
//   Name: "Monstro",
//   Title: "Infamous Whale",
//   Characteristics: ["storyborn"],
//   Text: "Rush (This character can challenge the turn they're played.)\nFULL BREACH Choose and discard a card - Ready this character. He can't quest for the rest of this turn.",
//   Type: "character",
//   Abilities: [rushAbility, fullBreach],
//   Inkwell: true,
//   Colors: ["amethyst"],
//   Cost: 8,
//   Strength: 6,
//   Willpower: 8,
//   Illustrator: "Alexandria Neonakis",
//   Number: 64,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631393,
//   },
//   Rarity: "rare",
//   Lore: 2,
// };
//
