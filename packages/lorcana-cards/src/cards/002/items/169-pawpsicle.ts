import type { ItemCard } from "@tcg/lorcana-types";

export const pawpsicle: ItemCard = {
  id: "s1u",
  cardType: "item",
  name: "Pawpsicle",
  inkType: ["sapphire"],
  franchise: "Zootropolis",
  set: "002",
  text: "JUMBO POP When you play this item, you may draw a card.\nTHAT'S REDWOOD Banish this item — Remove up to 2 damage from chosen character.",
  cost: 1,
  cardNumber: 169,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "651952e179e63cca4db165a7416ab0c4d3f16556",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whenYouPlayMayDrawACard } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
//
// const chosenCharacter: CardEffectTarget = {
//   type: "card",
//   value: 1,
//   filters: [
//     { filter: "zone", value: "play" },
//     { filter: "type", value: "character" },
//   ],
// };
//
// export const pawpsicle: LorcanitoItemCard = {
//   id: "qu5",
//   name: "Pawpsicle",
//   characteristics: ["item"],
//   text: "**JUMBO POP** When you play this item, you may draw a card.\n\n**THAT'S REDWOOD** Banish this item − Remove up to 2 damage from chosen character.",
//   type: "item",
//   abilities: [
//     {
//       ...whenYouPlayMayDrawACard,
//       name: "Jumbo Pop",
//     },
//     {
//       type: "activated",
//       name: "That's Redwood",
//       text: "Banish this item − Remove up to 2 damage from chosen character.",
//       optional: true,
//       costs: [{ type: "banish" }],
//       effects: [
//         {
//           type: "heal",
//           amount: 2,
//           upTo: true,
//           target: chosenCharacter,
//         },
//       ],
//     } as ActivatedAbility,
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 1,
//   illustrator: "Isaiah Mesq",
//   number: 169,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527535,
//   },
//   rarity: "common",
// };
//
