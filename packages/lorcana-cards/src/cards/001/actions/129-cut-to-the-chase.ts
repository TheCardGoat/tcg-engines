import type { ActionCard } from "@tcg/lorcana-types";
import { gainKeyword, staticAbility } from "../../ability-helpers";

export const cutToTheChase: ActionCard = {
  id: "5a0",
  cardType: "action",
  name: "Cut to the Chase",
  inkType: ["ruby"],
  set: "001",
  text: "Chosen character gains Rush this turn. (They can challenge the turn they're played.)",
  cost: 2,
  cardNumber: 129,
  inkable: true,
  externalIds: {
    ravensburger: "13057e6bb6112157b88c4ebbaec83cc1a20d9e5c",
  },
  abilities: [
    staticAbility("5a0-1", {
      text: "Chosen character gains Rush this turn.",
      effect: gainKeyword("Rush", "CHOSEN_CHARACTER"),
    }),
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { AbilityEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// export const cutToTheChase: LorcanitoActionCard = {
//   id: "cei",
//   name: "Cut to the Chase",
//   characteristics: ["action"],
//   text: "Chosen character gains **Rush** this turn. _(They can challenge the turn they're played.)_",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Cut to the Chase",
//       text: "Chosen character gains **Rush** this turn. _(They can challenge the turn they're played.)_",
//       effects: [
//         {
//           type: "ability",
//           ability: "rush",
//           modifier: "add",
//           duration: "turn",
//           until: true,
//           target: chosenCharacter,
//         } as AbilityEffect,
//       ],
//     },
//   ],
//   flavour: "Surprise!",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 2,
//   illustrator: "Ellie Horie",
//   number: 129,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508615,
//   },
//   rarity: "uncommon",
// };
//
