import type { ItemCard } from "@tcg/lorcana-types";

export const scepterOfArendelle: ItemCard = {
  id: "1j9",
  cardType: "item",
  name: "Scepter of Arendelle",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "001",
  text: "COMMAND {E} — Chosen character gains Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 1,
  cardNumber: 170,
  inkable: true,
  externalIds: {
    ravensburger: "c727888823a011c91f8ab8c27400f74ffd775c06",
  },
  abilities: [
    {
      id: "1j9-1",
      text: "COMMAND {E} — Chosen character gains Support this turn.",
      name: "COMMAND",
      type: "activated",
      cost: {
        exert: true,
      },
      effect: {
        type: "gain-keyword",
        keyword: "Support",
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { AbilityEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// export const scepterOfArendelle: LorcanitoItemCard = {
//   characteristics: ["item"],
//   id: "ao2",
//
//   name: "Scepter Of Arendelle",
//   text: "**COMMAND** {E} − Chosen character gains **Support** this turn. _(Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)_",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "Command",
//       text: "Chosen character gains **Support** this turn.",
//       costs: [{ type: "exert" }],
//       effects: [
//         {
//           type: "ability",
//           ability: "support",
//           modifier: "add",
//           duration: "turn",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "zone", value: "play" },
//               { filter: "type", value: "character" },
//             ],
//           },
//         } as AbilityEffect,
//       ],
//     } as ActivatedAbility,
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 1,
//   illustrator: "Grace Tran",
//   number: 170,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 505963,
//   },
//   rarity: "uncommon",
// };
//
