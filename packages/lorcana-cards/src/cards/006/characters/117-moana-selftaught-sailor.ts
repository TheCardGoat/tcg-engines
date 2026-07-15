// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { dontHaveCaptainInPlay } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// Import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// Export const moanaSelftaughtSailor: LorcanitoCharacterCard = {
//   Id: "hpk",
//   Name: "Moana",
//   Title: "Self-Taught Sailor",
//   Characteristics: ["dreamborn", "hero", "princess", "pirate"],
//   Text: "LEARNING THE ROPES This character can't challenge unless you have a Captain character in play.",
//   Type: "character",
//   Abilities: [
//     {
//       Type: "static",
//       Ability: "effects",
//       Name: "Learning the Ropes",
//       Text: "This character can't challenge unless you have a Captain character in play.",
//       Conditions: [dontHaveCaptainInPlay],
//       Effects: [
//         {
//           Type: "restriction",
//           Restriction: "challenge",
//           Duration: "static",
//           Target: thisCharacter,
//         },
//       ],
//     },
//   ],
//   Inkwell: true,
//   Colors: ["ruby"],
//   Cost: 1,
//   Strength: 3,
//   Willpower: 2,
//   Lore: 1,
//   Illustrator: "Koni",
//   Number: 117,
//   Set: "006",
//   ExternalIds: {
//     TcgPlayer: 591990,
//   },
//   Rarity: "common",
// };
//
