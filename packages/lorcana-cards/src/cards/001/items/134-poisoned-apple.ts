import type { ItemCard } from "@tcg/lorcana-types";

export const poisonedApple: ItemCard = {
  id: "g0y",
  cardType: "item",
  name: "Poisoned Apple",
  version: "undefined",
  fullName: "Poisoned Apple - undefined",
  inkType: ["ruby"],
  franchise: "Disney",
  set: "001",
  text: "**TAKE A BITE . . . ** 1 {I}, Banish this item − Exert chosen character. If a Princess character is chosen, banish her instead.",
  cost: 3,
  cardNumber: 134,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
// import type {
//   ExertEffect,
//   TargetConditionalEffect,
// } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// const chosenCharacter: CardEffectTarget = {
//   type: "card",
//   value: 1,
//   filters: [
//     { filter: "type", value: "character" },
//     { filter: "zone", value: "play" },
//   ],
// };
//
// export const poisonedApple: LorcanitoItemCard = {
//   characteristics: ["item"],
//   id: "g0y",
//
//   name: "Poisoned Apple",
//   text: "**TAKE A BITE . . . ** 1 {I}, Banish this item − Exert chosen character. If a Princess character is chosen, banish her instead.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "Poisoned Apple",
//       text: "Banish this item − Exert chosen character. If a Princess character is chosen, banish her instead.",
//       costs: [{ type: "banish" }, { type: "ink", amount: 1 }],
//       effects: [
//         {
//           type: "target-conditional",
//           autoResolve: false,
//           // TODO: RE implement conditional target, this is not correct
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "characteristics", value: ["princess"] },
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//           effects: [
//             {
//               type: "banish",
//               target: {
//                 type: "card",
//                 value: 1,
//                 filters: [
//                   { filter: "characteristics", value: ["princess"] },
//                   { filter: "type", value: "character" },
//                   { filter: "zone", value: "play" },
//                 ],
//               },
//             },
//           ],
//           fallback: [
//             {
//               type: "exert",
//               exert: true,
//               target: chosenCharacter,
//             } as ExertEffect,
//           ],
//         } as TargetConditionalEffect,
//       ],
//     } as ActivatedAbility,
//   ],
//   flavour:
//     "One taste of the poisoned apple, and the victim's eyes will close forever. . . . \n−The Queen",
//   colors: ["ruby"],
//   cost: 3,
//   illustrator: "Andrew Trabbold",
//   number: 134,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 507862,
//   },
//   rarity: "rare",
// };
//
