// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type {
//   LorcanitoCharacterCard,
//   TargetFilter,
// } from "@lorcanito/lorcana-engine";
// Import {
//   ShiftAbility,
//   SingerAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { wheneverThisCharSings } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// Const filters: TargetFilter[] = [
//   {
//     Filter: "attribute",
//     Value: "cost",
//     Comparison: { operator: "lte", value: 9 },
//   },
//   { filter: "owner", value: "self" },
//   { filter: "zone", value: "deck" },
//   { filter: "characteristics", value: ["song"] },
// ];
//
// Export const powerlineWorldsGreatestRockStar: LorcanitoCharacterCard = {
//   Id: "ia6",
//   Name: "Powerline",
//   Title: "World's Greatest Rock Star",
//   Characteristics: ["floodborn"],
//   Text: "Shift 4 {I} (You may pay 4 {I} to play this on top of one of your characters named Powerline.)\nSinger 9\nMASH-UP Once during your turn, whenever this character sings a song, look at the top 4 cards of your deck. You may reveal a song card with cost 9 or less and play it for free. Put the rest on the bottom of your deck in any order.",
//   Type: "character",
//   Inkwell: true,
//   Colors: ["ruby"],
//   Cost: 6,
//   Strength: 6,
//   Willpower: 4,
//   Illustrator: "Nicholas Kole",
//   Number: 110,
//   Set: "009",
//   ExternalIds: {
//     TcgPlayer: 649224,
//   },
//   Rarity: "super_rare",
//   Abilities: [
//     ShiftAbility(4, "Powerline"),
//     SingerAbility(9),
//     WheneverThisCharSings({
//       Name: "MASH-UP",
//       Text: "Once during your turn, whenever this character sings a song, look at the top 4 cards of your deck. You may reveal a song card with cost 9 or less and play it for free. Put the rest on the bottom of your deck in any order.",
//       OncePerTurn: true,
//       Effects: [
//         {
//           Type: "scry",
//           Amount: 4,
//           Mode: "bottom",
//           Target: self,
//           Limits: {
//             Bottom: 4,
//             Play: 1,
//             Top: 0,
//             Inkwell: 0,
//           },
//           PlayFilters: filters,
//           TutorFilters: filters,
//         },
//       ],
//     }),
//   ],
//   Lore: 2,
// };
//
