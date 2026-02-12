// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type {
//   LorcanitoActionCard,
//   ResolutionAbility,
//   TargetFilter,
// } from "@lorcanito/lorcana-engine";
// Import { self } from "@lorcanito/lorcana-engine/abilities/targets";
//
// Const downInNewOrleansFilter: TargetFilter[] = [
//   { filter: "owner", value: "self" },
//   { filter: "zone", value: "deck" },
//   { filter: "type", value: ["character", "item", "location"] },
//   {
//     Filter: "attribute",
//     Value: "cost",
//     Comparison: { operator: "lte", value: 6 },
//   },
// ];
//
// Const downInNewOrleansAbility: ResolutionAbility = {
//   Type: "resolution",
//   Effects: [
//     {
//       Type: "scry",
//       Amount: 3,
//       Mode: "bottom",
//       ShouldRevealTutored: true,
//       PlayExerted: false,
//       Target: self,
//       Limits: {
//         Bottom: 3,
//         Play: 1,
//       },
//       PlayFilters: downInNewOrleansFilter,
//       TutorFilters: downInNewOrleansFilter,
//     },
//   ],
// };
//
// Export const downInNewOrleans: LorcanitoActionCard = {
//   Id: "py1",
//   Name: "Down In New Orleans",
//   Characteristics: ["action", "song"],
//   Text: "Look at the top 3 cards of your deck. You may reveal a character, item, or location card with cost 6 or less and play it for free. Put the rest on the bottom of your deck in any order.",
//   Type: "action",
//   Inkwell: false,
//   Colors: ["sapphire"],
//   Cost: 6,
//   Illustrator: "Robin Chung",
//   Number: 177,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631845,
//   },
//   Rarity: "super_rare",
//   Abilities: [downInNewOrleansAbility],
// };
//
