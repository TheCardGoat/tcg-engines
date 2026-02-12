// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { vanishAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const abuIllusoryPachyderm: LorcanitoCharacterCard = {
//   Id: "l54",
//   Name: "Abu",
//   Title: "Illusory Pachyderm",
//   Characteristics: ["dreamborn", "ally", "illusion"],
//   Text: "Vanish\nGRASPING TRUNK Whenever this character quests, gain lore equal to the {L} of chosen opposing character.",
//   Type: "character",
//   Abilities: [
//     VanishAbility,
//     WheneverQuests({
//       Name: "GRASPING TRUNK",
//       Text: "Whenever this character quests, gain lore equal to the {L} of chosen opposing character.",
//       Effects: [
//         {
//           Type: "create-layer-based-on-target",
//           Target: chosenOpposingCharacter,
//           // TODO: this is working kind of by accident
//           // the dynamic amount from the parent effect forces this amount to be replaced.
//           ResolveAmountBeforeCreatingLayer: true,
//           Effects: [
//             YouGainLore({
//               Dynamic: true,
//               Target: { attribute: "lore" },
//             }),
//           ],
//         },
//       ],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["amethyst", "steel"],
//   Cost: 6,
//   Strength: 3,
//   Willpower: 7,
//   Illustrator: "Grace Tran",
//   Number: 50,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631384,
//   },
//   Rarity: "uncommon",
//   Lore: 1,
// };
//
