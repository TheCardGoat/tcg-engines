// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import {
//   ChosenCharacterNamed,
//   ThisCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const faZhouMulansFather: LorcanitoCharacterCard = {
//   Id: "ex8",
//   MissingTestCase: true,
//   Name: "Fa Zhou",
//   Title: "Mulan's Father",
//   Characteristics: ["storyborn", "mentor"],
//   Text: "**WAR WOUND** This character cannot challenge.\n\n\n**HEAD OF FAMILY** {E} - Ready chosen character named Mulan. They can't quest for the rest of the turn.",
//   Type: "character",
//   Abilities: [
//     {
//       Type: "static",
//       Ability: "effects",
//       Name: "War Wound",
//       Text: "This character cannot challenge.",
//       Effects: [
//         {
//           Type: "restriction",
//           Restriction: "challenge",
//           Target: thisCharacter,
//         },
//       ],
//     },
//     {
//       Type: "activated",
//       Costs: [{ type: "exert" }],
//       Name: "Head of Family",
//       Text: "{E} - Ready chosen character named Mulan. They can't quest for the rest of the turn.",
//       Effects: readyAndCantQuest(chosenCharacterNamed("mulan")),
//     },
//   ],
//   Flavour: '"I am ready to serve the Emperor."',
//   Inkwell: true,
//   Colors: ["ruby"],
//   Cost: 2,
//   Willpower: 4,
//   Strength: 0,
//   Lore: 1,
//   Illustrator: "Carmine Pucci",
//   Number: 105,
//   Set: "URR",
//   ExternalIds: {
//     TcgPlayer: 550590,
//   },
//   Rarity: "common",
// };
//
