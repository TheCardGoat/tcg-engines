// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type {
//   AbilityEffect,
//   LorcanitoActionCard,
//   ResolutionAbility,
// } from "@lorcanito/lorcana-engine";
// Import { singerTogetherAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import {
//   AllOpposingCharacters,
//   AllYourCharacters,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
//
// Const gainsDamageProtection: AbilityEffect = {
//   Type: "ability",
//   Ability: "custom",
//   Modifier: "add",
//   Duration: "turn",
//   Target: allYourCharacters,
//   CustomAbility: {
//     Type: "static",
//     Ability: "effects",
//     Effects: [
//       {
//         Type: "protection",
//         From: "damage",
//         As: "attacker",
//         Target: allOpposingCharacters,
//       },
//     ],
//   },
// };
//
// Const ability: ResolutionAbility = {
//   Type: "resolution",
//   Effects: [...readyAndCantQuest(allYourCharacters), gainsDamageProtection],
// };
//
// Export const nothingWeWontDo: LorcanitoActionCard = {
//   Id: "pm2",
//   Name: "Nothing We Won't Do",
//   Characteristics: ["action", "song"],
//   Text: "Sing Together 8\nReady all your characters. For the rest of this turn, they take no damage from challenges and can't quest.",
//   Type: "action",
//   Abilities: [singerTogetherAbility(8), ability],
//   Inkwell: true,
//   Colors: ["ruby"],
//   Cost: 8,
//   Illustrator: "Jeanne Plattenet",
//   Number: 147,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631447,
//   },
//   Rarity: "rare",
// };
//
