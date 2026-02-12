// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// Export const magicaDeSpellShadowForm: LorcanitoCharacterCard = {
//   Id: "t1p",
//   Name: "Magica De Spell",
//   Title: "Shadow Form",
//   Characteristics: ["storyborn", "villain", "sorcerer"],
//   Text: "Evasive (Only characters with Evasive can challenge this character.)\nDANCE OF DARKNESS When you play this character, you may return one of your other characters to your hand to draw a card.",
//   Type: "character",
//   Abilities: [
//     EvasiveAbility,
//     WhenYouPlayThis({
//       Name: "DANCE OF DARKNESS",
//       Text: "When you play this character, you may return one of your other characters to your hand to draw a card.",
//       Optional: true,
//       Effects: [
//         {
//           Type: "move",
//           To: "hand",
//           IsPrivate: false,
//           ShouldRevealMoved: true,
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "self" },
//               { filter: "type", value: "character" },
//               { filter: "source", value: "other" },
//             ],
//           },
//         },
//         {
//           Type: "draw",
//           Amount: 1,
//           Target: self,
//         },
//       ],
//     }),
//   ],
//   Inkwell: false,
//   Colors: ["amethyst", "emerald"],
//   Cost: 5,
//   Strength: 3,
//   Willpower: 3,
//   Illustrator: "Sandara Tang",
//   Number: 66,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 632709,
//   },
//   Rarity: "uncommon",
//   Lore: 2,
// };
//
