// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import {
//   ChosenCharacter,
//   ChosenItemOfYours,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Const iVeHadIt: ActivatedAbility = {
//   Type: "activated",
//   Name: "I'VE HAD IT!",
//   Text: "{E}, 2 {I}, Banish 2 of your items – Deal 5 damage to chosen character.",
//   Costs: [
//     { type: "exert" },
//     { type: "ink", amount: 2 },
//     {
//       Type: "card",
//       Action: "banish",
//       Amount: 2,
//       Filters: chosenItemOfYours.filters,
//     },
//   ],
//   Effects: [
//     {
//       Type: "damage",
//       Amount: 5,
//       Target: chosenCharacter,
//     },
//   ],
// };
//
// Export const beastFrustratedDesigner: LorcanitoCharacterCard = {
//   Id: "tum",
//   Name: "Beast",
//   Title: "Frustrated Designer",
//   Characteristics: ["dreamborn", "hero", "prince", "inventor"],
//   Text: "I'VE HAD IT! {E}, 2 {I}, Banish 2 of your items – Deal 5 damage to chosen character.",
//   Type: "character",
//   Abilities: [iVeHadIt],
//   Inkwell: false,
//
//   Colors: ["ruby", "sapphire"],
//   Cost: 6,
//   Strength: 5,
//   Willpower: 5,
//   Illustrator: "Koni",
//   Number: 136,
//   Set: "007",
//   ExternalIds: {
//     TcgPlayer: 618145,
//   },
//   Rarity: "rare",
//   Lore: 2,
// };
//
