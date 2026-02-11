// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// Import {
//   AllYourCharacters,
//   ChosenCharacterOfYoursAtLocation,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// Import {
//   ReadyAndCantQuest,
//   YouGainLore,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const iveGotADream: LorcanitoActionCard = {
//   Id: "ntx",
//   Name: "I've Got a Dream",
//   Characteristics: ["action", "song"],
//   Text: "Ready chosen character of yours at a location. They can't quest for the rest of this turn. Gain lore equal to that location {L}.",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Effects: [
//         ...readyAndCantQuest(chosenCharacterOfYoursAtLocation),
//         {
//           Type: "create-layer-based-on-target",
//           ResolveAmountBeforeCreatingLayer: true,
//           Effects: [
//             YouGainLore({
//               Dynamic: true,
//               TargetLocation: { attribute: "lore" },
//             }),
//           ],
//           // TODO: Get rid of target
//           Target: allYourCharacters,
//         },
//       ],
//     },
//   ],
//   Flavour:
//     "Tor would like to quit and be a florist \nGunther does interior design",
//   Inkwell: true,
//   Colors: ["ruby"],
//   Cost: 2,
//   Illustrator: "Cacciatore Michaela",
//   Number: 129,
//   Set: "ITI",
//   ExternalIds: {
//     TcgPlayer: 531825,
//   },
//   Rarity: "uncommon",
// };
//
