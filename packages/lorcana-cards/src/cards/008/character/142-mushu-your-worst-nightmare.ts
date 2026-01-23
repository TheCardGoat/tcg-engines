// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverTargetPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import {
//   theyGainEvasive,
//   theyGainReckless,
//   theyGainRush,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const mushuYourWorstNightmare: LorcanitoCharacterCard = {
//   id: "eyj",
//   name: "Mushu",
//   title: "Your Worst Nightmare",
//   characteristics: ["floodborn", "ally", "dragon"],
//   text: "Shift 4\nALL FIRED UP Whenever you play another character, they gain Rush, Reckless, and Evasive this turn. ",
//   type: "character",
//   abilities: [
//     shiftAbility(4, "Mushu"),
//     wheneverTargetPlays({
//       name: "ALL FIRED UP",
//       text: "Whenever you play another character, they gain Rush, Reckless, and Evasive this turn.",
//       excludeSelf: true,
//       triggerFilter: [
//         { filter: "type", value: "character" },
//         { filter: "owner", value: "self" },
//       ],
//       effects: [theyGainEvasive, theyGainRush, theyGainReckless],
//     }),
//   ],
//   inkwell: true,
//   colors: ["ruby", "steel"],
//   cost: 6,
//   strength: 4,
//   willpower: 6,
//   illustrator: "Jared Mathews",
//   number: 142,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631443,
//   },
//   rarity: "rare",
//   lore: 2,
// };
//
