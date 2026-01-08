import type { CharacterCard } from "@tcg/lorcana-types";

export const iagoLoudmouthedParrot: CharacterCard = {
  id: "s1f",
  cardType: "character",
  name: "Iago",
  version: "Loud-Mouthed Parrot",
  fullName: "Iago - Loud-Mouthed Parrot",
  inkType: ["emerald"],
  franchise: "Disney",
  set: "001",
  text: "**YOU GOT A PROBLEM** {E} − Chosen character gains **Reckless** during their next turn. _(They can",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 1,
  cardNumber: 80,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { AbilityEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// export const iagoLoudMouthedParrot: LorcanitoCharacterCard = {
//   id: "s1f",
//   name: "Iago",
//   title: "Loud-Mouthed Parrot",
//   characteristics: ["storyborn", "ally"],
//   text: "**YOU GOT A PROBLEM** {E} − Chosen character gains **Reckless** during their next turn. _(They can't quest and must challenge if able.)_",
//   type: "character",
//   abilities: [
//     {
//       type: "activated",
//       name: "YOU GOT A PROBLEM?",
//       text: "{E} − Chosen character gains **Reckless** during their next turn. _(They can't quest and must challenge if able.)_",
//       costs: [{ type: "exert" }],
//       effects: [
//         {
//           type: "ability",
//           ability: "reckless",
//           modifier: "add",
//           duration: "next_turn",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "opponent" },
//               { filter: "type", value: "character" },
//             ],
//           },
//         } as AbilityEffect,
//       ],
//     } as ActivatedAbility,
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 3,
//   strength: 1,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Brian Weisz",
//   number: 80,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 497207,
//   },
//   rarity: "rare",
// };
//
