import type { ActionCard } from "@tcg/lorcana-types";

export const workTogether: ActionCard = {
  id: "118",
  cardType: "action",
  name: "Work Together",
  inkType: ["sapphire"],
  franchise: "Emperors New Groove",
  set: "001",
  text: "Chosen character gains Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 1,
  cardNumber: 165,
  inkable: true,
  externalIds: {
    ravensburger: "e3a118a64cb987ccb8930d3b51c32bdde97eaea6",
  },
  abilities: [
    {
      id: "118-1",
      text: "Chosen character gains Support this turn.",
      type: "static",
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
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { chosenCharacterGainsSupport } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const workTogether: LorcanitoActionCard = {
//   id: "cxh",
//   name: "Work Together",
//   characteristics: ["action"],
//   text: "Chosen character gains **Support** this turn. _(Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)_",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Work Together",
//       text: "Chosen character gains **Support** this turn.",
//       effects: [chosenCharacterGainsSupport("turn")],
//     },
//   ],
//   flavour:
//     "Pacha: Put your whole back into it! \nKuzco: This is my whole back!",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 1,
//   illustrator: "Bill Robinson",
//   number: 165,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508889,
//   },
//   rarity: "common",
// };
//
