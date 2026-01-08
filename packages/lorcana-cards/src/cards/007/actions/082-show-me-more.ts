import type { ActionCard } from "@tcg/lorcana-types";

export const showMeMore: ActionCard = {
  id: "11i",
  cardType: "action",
  name: "Show Me More!",
  inkType: ["amethyst"],
  franchise: "Snow White",
  set: "007",
  text: "Each player draws 3 cards.",
  cost: 2,
  cardNumber: 82,
  inkable: false,
  externalIds: {
    ravensburger: "873eefb76cf90cb4ec1223e2e0418e03236723b2",
  },
  abilities: [
    {
      id: "11i-1",
      type: "action",
      effect: {
        type: "draw",
        amount: 3,
        target: "EACH_PLAYER",
      },
      text: "Each player draws 3 cards.",
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { showMeMoreAbilities } from "@lorcanito/lorcana-engine/cards/007/abilities";
//
// export const showMeMore: LorcanitoActionCard = {
//   id: "f8z",
//   name: "Show Me More!",
//   characteristics: ["action"],
//   text: "Each player draws 3 cards.",
//   type: "action",
//   abilities: showMeMoreAbilities,
//   inkwell: false,
//   colors: ["amethyst"],
//   cost: 2,
//   illustrator: "Natalie Dombois",
//   number: 82,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619449,
//   },
//   rarity: "super_rare",
// };
//
