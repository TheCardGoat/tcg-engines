// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { chosenCharacterGainsRush } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const mushusRocket: LorcanitoItemCard = {
//   id: "z0q",
//   name: "Mushu's Rocket",
//   characteristics: ["item"],
//   text: "I NEED FIREPOWER When you play this item, chosen character gains Rush this turn. (They can challenge the turn they're played.)\nHITCH A RIDE 2 {I}, Banish this item — Chosen character gains Rush this turn.",
//   type: "item",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 1,
//   illustrator: "Brooks Eggleston",
//   number: 134,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659423,
//   },
//   rarity: "uncommon",
//   abilities: [
//     // I NEED FIREPOWER - When you play this item, chosen character gains Rush this turn
//     whenYouPlayThis({
//       name: "I NEED FIREPOWER",
//       text: "When you play this item, chosen character gains Rush this turn. (They can challenge the turn they're played.)",
//       effects: [chosenCharacterGainsRush],
//       target: chosenCharacter,
//     }),
//     // HITCH A RIDE - 2 {I}, Banish this item — Chosen character gains Rush this turn
//     {
//       type: "activated",
//       name: "HITCH A RIDE",
//       text: "2 {I}, Banish this item — Chosen character gains Rush this turn.",
//       costs: [{ type: "ink", amount: 2 }, { type: "banish" }],
//       effects: [chosenCharacterGainsRush],
//     },
//   ],
// };
//
