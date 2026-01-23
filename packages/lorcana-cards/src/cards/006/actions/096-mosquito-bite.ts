import type { ActionCard } from "@tcg/lorcana-types";

export const mosquitoBite: ActionCard = {
  id: "1xn",
  cardType: "action",
  name: "Mosquito Bite",
  inkType: ["emerald"],
  franchise: "Lilo and Stitch",
  set: "006",
  text: "Put 1 damage counter on chosen character.",
  cost: 1,
  cardNumber: 96,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "fa00070954fa24098d79edb1d418f0e85d50bfc4",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { putDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const mosquitoBite: LorcanitoActionCard = {
//   id: "zw6",
//   name: "Mosquito Bite",
//   characteristics: ["action"],
//   text: "Put 1 damage counter on chosen character.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       effects: [putDamageEffect(1, chosenCharacter)],
//     },
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 1,
//   illustrator: "Kamil Murzyn",
//   number: 96,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 592021,
//   },
//   rarity: "uncommon",
// };
//
