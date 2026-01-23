// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { challengerAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverTargetPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const philoctetesNoNonsenseInstructor: LorcanitoCharacterCard = {
//   id: "onn",
//   reprints: ["g10"],
//   name: "Philoctetes",
//   title: "No-Nonsense Instructor",
//   characteristics: ["storyborn", "ally"],
//   text: "**YOU GOTTA STAY FOCUSED** Your Hero characters gain **Challenger** +1. _(They get +1 {S} while challenging.)_\n\n\n**SHAMELESS PROMOTER** Whenever you play a Hero character, gain 1 lore.",
//   type: "character",
//   abilities: [
//     {
//       type: "static",
//       ability: "gain-ability",
//       name: "You Gotta Stay Focused",
//       text: "Your Hero characters gain **Challenger** +1. _(They get +1 {S} while challenging.)_",
//       gainedAbility: challengerAbility(1),
//       target: {
//         type: "card",
//         value: "all",
//         filters: [
//           { filter: "zone", value: "play" },
//           { filter: "owner", value: "self" },
//           { filter: "characteristics", value: ["hero"] },
//         ],
//       },
//     },
//     {
//       name: "Shameless Promoter",
//       text: "Whenever you play a Hero character, gain 1 lore.",
//       ...wheneverTargetPlays({
//         triggerFilter: [
//           { filter: "type", value: "character" },
//           { filter: "characteristics", value: ["hero"] },
//           { filter: "owner", value: "self" },
//         ],
//         effects: [youGainLore(1)],
//       }),
//     },
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 4,
//   strength: 2,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Stefano Spagnuolo",
//   number: 190,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 549463,
//   },
//   rarity: "rare",
// };
//
