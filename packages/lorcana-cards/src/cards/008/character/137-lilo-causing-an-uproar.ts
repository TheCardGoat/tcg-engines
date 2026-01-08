// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const liloCausingAnUproar: LorcanitoCharacterCard = {
//   id: "x31",
//   name: "Lilo",
//   title: "Causing an Uproar",
//   characteristics: ["dreamborn", "hero"],
//   text: "STOMPIN' TIME! During your turn, if you've played 3 or more actions this turn, you may play this character for free.\nRAAAWR! When you play this character, ready chosen character. They can't quest for the rest of this turn.",
//   type: "character",
//   abilities: [
//     {
//       type: "static",
//       conditions: [
//         { type: "during-turn", value: "self" },
//         { type: "played-actions", comparison: { operator: "gte", value: 3 } },
//       ],
//       name: "STOMPIN' TIME!",
//       ability: "effects",
//       text: "During your turn, if you've played 3 or more actions this turn, you may play this character for free.",
//       effects: [
//         {
//           type: "replacement",
//           replacement: "cost",
//           duration: "static",
//           amount: 5,
//           target: thisCharacter,
//         },
//       ],
//     },
//     whenYouPlayThis({
//       name: "RAAAWR!",
//       text: "When you play this character, ready chosen character. They can't quest for the rest of this turn.",
//       optional: false,
//       effects: [
//         ...readyAndCantQuest({
//           type: "card",
//           value: 1,
//           filters: [
//             { filter: "type", value: "character" },
//             { filter: "zone", value: "play" },
//           ],
//         }),
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 5,
//   strength: 4,
//   willpower: 4,
//   illustrator: "Julien Vandois",
//   number: 137,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631439,
//   },
//   rarity: "legendary",
//   lore: 2,
// };
//
