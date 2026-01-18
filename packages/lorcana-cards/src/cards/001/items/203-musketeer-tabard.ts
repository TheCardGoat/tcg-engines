import type { ItemCard } from "@tcg/lorcana-types";
import { draw, optional, whenBanished } from "../../ability-helpers";

export const musketeerTabard: ItemCard = {
  id: "8a5",
  cardType: "item",
  name: "Musketeer Tabard",
  inkType: ["steel"],
  set: "001",
  text: "ALL FOR ONE AND ONE FOR ALL Whenever one of your characters with Bodyguard is banished, you may draw a card.",
  cost: 4,
  cardNumber: 203,
  inkable: false,
  externalIds: {
    ravensburger: "1dd9513f5330b41950fea67f21d19e751b9551a2",
  },
  abilities: [
    whenBanished("8a5-1", {
      name: "ALL FOR ONE AND ONE FOR ALL",
      text: "ALL FOR ONE AND ONE FOR ALL Whenever one of your characters with Bodyguard is banished, you may draw a card.",
      timing: "whenever",
      on: "YOUR_OTHER_CHARACTERS",
      then: optional(draw(1)),
    }),
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { TriggeredAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { BanishTrigger } from "@lorcanito/lorcana-engine/abilities/triggers";
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const musketeerTabard: LorcanitoItemCard = {
//   characteristics: ["item"],
//   id: "j3v",
//
//   name: "Musketeer Tabard",
//   text: "**ALL FOR ONE AND ONE FOR ALL** Whenever one of your characters with **Bodyguard** is banished, you may draw a card.",
//   type: "item",
//   abilities: [
//     {
//       type: "static-triggered",
//       optional: false,
//       trigger: {
//         on: "banish",
//         filters: [
//           { filter: "owner", value: "self" },
//           { filter: "type", value: "character" },
//           { filter: "ability", value: "bodyguard" },
//         ],
//       } as BanishTrigger,
//       layer: {
//         type: "resolution",
//         optional: true,
//         effects: [
//           {
//             type: "draw",
//             amount: 1,
//             target: {
//               type: "player",
//               value: "self",
//             },
//           },
//         ],
//       },
//     } as TriggeredAbility,
//   ],
//   flavour: "There's no such thing as a lone musketeer.",
//   colors: ["steel"],
//   cost: 4,
//   illustrator: "Dav Augereau / Guykua Ruva",
//   number: 203,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 505951,
//   },
//   rarity: "rare",
// };
//
