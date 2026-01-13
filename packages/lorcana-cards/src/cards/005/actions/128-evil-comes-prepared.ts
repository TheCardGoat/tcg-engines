import type { ActionCard } from "@tcg/lorcana-types";

export const evilComesPrepared: ActionCard = {
  id: "1qd",
  cardType: "action",
  name: "Evil Comes Prepared",
  inkType: ["ruby"],
  franchise: "Lion King",
  set: "005",
  text: "Ready chosen character of yours. They can't quest for the rest of this turn. If a Villain character is chosen, gain 1 lore.",
  cost: 2,
  cardNumber: 128,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e0cea4262def4296207693e1e943c8c7c29b4591",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   CardEffectTarget,
//   LorcanitoActionCard,
//   TargetConditionalEffect,
// } from "@lorcanito/lorcana-engine";
// import { chosenCharacterOfYours } from "@lorcanito/lorcana-engine/abilities/targets";
// import {
//   readyAndCantQuest,
//   youGainLore,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// const targetingVillain: CardEffectTarget = {
//   type: "card",
//   value: 1,
//   filters: [
//     { filter: "type", value: "character" },
//     { filter: "zone", value: "play" },
//     { filter: "owner", value: "self" },
//     {
//       filter: "characteristics",
//       value: ["villain"],
//     },
//   ],
// };
//
// const evilComesEffect: TargetConditionalEffect = {
//   type: "target-conditional",
//   effects: [...readyAndCantQuest(targetingVillain), youGainLore(1)],
//   fallback: [...readyAndCantQuest(chosenCharacterOfYours)],
//   // TODO: Re implement conditional target
//   target: targetingVillain,
// };
//
// export const evilComesPrepared: LorcanitoActionCard = {
//   id: "xc5",
//   missingTestCase: true,
//   name: "Evil Comes Prepared",
//   characteristics: ["action"],
//   text: "Ready chosen character of yours. They can’t quest for the rest of this turn. If a Villain character is chosen, gain 1 lore.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       text: "Ready chosen character of yours. They can’t quest for the rest of this turn. If a Villain character is chosen, gain 1 lore.",
//       effects: [evilComesEffect],
//     },
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 2,
//   lore: 1,
//   illustrator: "Adam Bunch",
//   number: 128,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561964,
//   },
//   rarity: "common",
// };
//
