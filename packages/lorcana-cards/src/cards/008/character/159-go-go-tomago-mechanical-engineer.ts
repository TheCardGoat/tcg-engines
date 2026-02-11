// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { whenPlayOnThisCard } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import { putTopCardOfYourDeckIntoYourInkwellExerted } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const goGoTomagoMechanicalEngineer: LorcanitoCharacterCard = {
//   Id: "p29",
//   Name: "Go Go Tomago",
//   Title: "Mechanical Engineer",
//   Characteristics: ["storyborn", "hero", "inventor"],
//   Text: "NEED THIS! When you play a Floodborn character on this card, you may put the top card of your deck into your inkwell facedown and exerted.",
//   Type: "character",
//   Abilities: [
//     WhenPlayOnThisCard({
//       Name: "NEED THIS!",
//       Text: "When you play a Floodborn character on this card, you may put the top card of your deck into your inkwell facedown and exerted.",
//       Optional: true,
//       Effects: [putTopCardOfYourDeckIntoYourInkwellExerted],
//       ShiftedTargetFilters: [{ filter: "source", value: "self" }],
//       ShifterTargetFilters: [
//         { filter: "characteristics", value: ["floodborn"] },
//         { filter: "owner", value: "self" },
//       ],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 2,
//   Strength: 1,
//   Willpower: 3,
//   Illustrator: "Jennifer Wu",
//   Number: 159,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631691,
//   },
//   Rarity: "common",
//   Lore: 1,
// };
//
