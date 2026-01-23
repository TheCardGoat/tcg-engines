import type { ItemCard } from "@tcg/lorcana-types";
import { ready } from "../../ability-helpers";

export const shieldOfVirtue: ItemCard = {
  id: "f35",
  cardType: "item",
  name: "Shield of Virtue",
  inkType: ["ruby"],
  franchise: "Sleeping Beauty",
  set: "001",
  text: "FIREPROOF {E}, 3 {I} — Ready chosen character. They can't quest for the rest of this turn.",
  cost: 1,
  cardNumber: 135,
  inkable: true,
  externalIds: {
    ravensburger: "36603d551c1f7baf9ea15d2dc93a461dbead7c0b",
  },
  abilities: [
    {
      id: "f35-1",
      text: "FIREPROOF {E}, 3 {I} — Ready chosen character. They can't quest for the rest of this turn.",
      name: "FIREPROOF",
      type: "activated",
      cost: {
        exert: true,
        ink: 3,
      },
      effect: ready("CHOSEN_CHARACTER", "cant-quest"),
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
// import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
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
// export const shieldOfVirtue: LorcanitoItemCard = {
//   characteristics: ["item"],
//   id: "pn4",
//
//   name: "Shield of Virtue",
//   text: "**FIREPROOF** {E}, 3 {I} − Ready chosen character. They can't quest for the rest of this turn.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "Fireproof",
//       text: "Ready chosen character. They can't quest for the rest of this turn.",
//       costs: [{ type: "exert" }, { type: "ink", amount: 3 }],
//       effects: readyAndCantQuest(chosenCharacter),
//     } as ActivatedAbility,
//   ],
//   flavour:
//     "Arm thyself with this enchanted Shield of Virtue and this mighty Sword of Truth, for these weapons of righteousness will triumph over evil. \n−Flora",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 1,
//   illustrator: "Eri Welli",
//   number: 135,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508789,
//   },
//   rarity: "uncommon",
// };
//
