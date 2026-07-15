// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { vanishAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import { exertChosenOpposingCharacter } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const theSultanRoyalApparition: LorcanitoCharacterCard = {
//   Id: "nrh",
//   Name: "The Sultan",
//   Title: "Royal Apparition",
//   Characteristics: ["dreamborn", "ally", "king", "illusion"],
//   Text: "Vanish (When an opponent chooses this character for an action, banish them.)\nCOMMANDING PRESENCE Whenever one of your Illusion characters quests, exert chosen opposing character.",
//   Type: "character",
//   Abilities: [
//     VanishAbility,
//     WheneverQuests({
//       Name: "COMMANDING PRESENCE",
//       Text: "Whenever one of your Illusion characters quests, exert chosen opposing character.",
//       TriggerTarget: {
//         Type: "card",
//         Value: "all",
//         Filters: [
//           { filter: "type", value: "character" },
//           { filter: "characteristics", value: ["illusion"] },
//           { filter: "owner", value: "self" },
//           { filter: "zone", value: "play" },
//         ],
//       },
//       Effects: [exertChosenOpposingCharacter],
//     }),
//   ],
//   Inkwell: false,
//   Colors: ["amethyst", "steel"],
//   Cost: 5,
//   Strength: 5,
//   Willpower: 5,
//   Illustrator: "Max Ulichney",
//   Number: 73,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 633425,
//   },
//   Rarity: "rare",
//   Lore: 2,
// };
//
