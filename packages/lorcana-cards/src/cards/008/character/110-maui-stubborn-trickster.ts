// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import {
//   AllOpposingCharacters,
//   AllOpposingItems,
//   AllOpposingLocations,
//   ChosenCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whenThisCharacterBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import { putDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
//
// Const imNotFinishedYet = whenThisCharacterBanished({
//   Name: "I'M NOT FINISHED YET",
//   Text: "When this character is banished, choose one:\n- Put 2 damage counters on all opposing characters.\n- Banish all opposing items.\n- Banish all opposing locations.",
//   Effects: [
//     {
//       Type: "modal",
//       // TODO: Get rid of target
//       Target: chosenCharacter,
//       Modes: [
//         {
//           Id: "1",
//           Text: "Put 2 damage counters on all opposing characters.",
//           Effects: [putDamageEffect(2, allOpposingCharacters)],
//         },
//         {
//           Id: "2",
//           Text: "Banish all opposing items.",
//           Effects: [
//             {
//               Type: "banish",
//               Target: allOpposingItems,
//             },
//           ],
//         },
//         {
//           Id: "3",
//           Text: "Banish all opposing locations.",
//           Effects: [
//             {
//               Type: "banish",
//               Target: allOpposingLocations,
//             },
//           ],
//         },
//       ],
//     },
//   ],
// });
//
// Export const mauiStubbornTrickster: LorcanitoCharacterCard = {
//   Id: "o9q",
//   Name: "Maui",
//   Title: "Stubborn Trickster",
//   Characteristics: ["storyborn", "hero", "deity"],
//   Text: "I'M NOT FINISHED YET When this character is banished, choose one:\n- Put 2 damage counters on all opposing characters.\n- Banish all opposing items.\n- Banish all opposing locations.",
//   Type: "character",
//   Abilities: [imNotFinishedYet],
//   Inkwell: true,
//   Colors: ["emerald", "steel"],
//   Cost: 6,
//   Strength: 4,
//   Willpower: 4,
//   Illustrator: "Natalie Dombois",
//   Number: 110,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 630062,
//   },
//   Rarity: "super_rare",
//   Lore: 3,
// };
//
