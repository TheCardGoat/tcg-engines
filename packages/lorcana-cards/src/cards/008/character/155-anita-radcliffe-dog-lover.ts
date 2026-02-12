// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import { chosenCharacterGainsResist } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const anitaRadcliffeDogLover: LorcanitoCharacterCard = {
//   Id: "cir",
//   Name: "Anita Radcliffe",
//   Title: "Dog Lover",
//   Characteristics: ["storyborn", "ally"],
//   Text: "I'LL TAKE CARE OF YOU When you play this character, you may give chosen Puppy character Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThis({
//       Name: "I'LL TAKE CARE OF YOU",
//       Text: "When you play this character, you may give chosen Puppy character Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
//       Optional: true,
//       Target: {
//         Type: "card",
//         Value: 1,
//         Filters: [
//           { filter: "characteristics", value: ["puppy"] },
//           { filter: "zone", value: "play" },
//           { filter: "owner", value: "self" },
//           { filter: "type", value: "character" },
//         ],
//       },
//       Effects: [chosenCharacterGainsResist(1, "next_turn")],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 3,
//   Strength: 3,
//   Willpower: 3,
//   Illustrator: "Carmine Pucci",
//   Number: 155,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 633100,
//   },
//   Rarity: "common",
//   Lore: 1,
// };
//
