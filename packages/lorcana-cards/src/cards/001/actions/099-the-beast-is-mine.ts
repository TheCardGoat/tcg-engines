import type { ActionCard } from "@tcg/lorcana-types";

export const theBeastIsMine: ActionCard = {
  id: "10f",
  cardType: "action",
  name: "The Beast is Mine!",
  inkType: ["emerald"],
  franchise: "Beauty and the Beast",
  set: "001",
  text: "Chosen character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
  cost: 3,
  cardNumber: 99,
  inkable: true,
  externalIds: {
    ravensburger: "8488fbd0b43280a0577520d149097ebe9d751d8f",
  },
  abilities: [
    {
      id: "10f-1",
      text: "Chosen character gains Reckless during their next turn.",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Reckless",
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { AbilityEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// export const theBeastIsMine: LorcanitoActionCard = {
//   id: "mlb",
//   name: "The Beast is Mine!",
//   characteristics: ["action"],
//   text: "Chosen character gains **Reckless** during their next turn. _(They can't quest and must challenge if able.)_",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "The Beast is Mine!",
//       text: "Chosen character gains **Reckless** during their next turn. _(They can't quest and must challenge if able.)_",
//       effects: [
//         {
//           type: "ability",
//           ability: "reckless",
//           modifier: "add",
//           duration: "next_turn",
//           target: chosenCharacter,
//         } as AbilityEffect,
//       ],
//     },
//   ],
//   flavour:
//     "It's only fitting that the finest hunter gets the foulest \rbeast!<br />\r− Gaston",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 3,
//   illustrator: "\tMatthew Robert Davies",
//   number: 99,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 494154,
//   },
//   rarity: "uncommon",
// };
//
