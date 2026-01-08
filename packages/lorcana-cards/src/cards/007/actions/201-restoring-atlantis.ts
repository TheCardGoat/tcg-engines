import type { ActionCard } from "@tcg/lorcana-types";

export const restoringAtlantis: ActionCard = {
  id: "g4p",
  cardType: "action",
  name: "Restoring Atlantis",
  inkType: ["steel"],
  franchise: "Atlantis",
  set: "007",
  text: "Your characters can't be challenged until the start of your next turn.",
  cost: 5,
  cardNumber: 201,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3a22bf1160fb323ece5b18abbcd5823cf6c9e990",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { restoringAtlantisAbility } from "@lorcanito/lorcana-engine/cards/007/abilities";
//
// export const restoringAtlantis: LorcanitoActionCard = {
//   id: "m7i",
//   name: "Restoring Atlantis",
//   characteristics: ["action"],
//   text: "Your characters can't be challenged until the start of your next turn.",
//   type: "action",
//   abilities: [restoringAtlantisAbility],
//   inkwell: false,
//   colors: ["steel"],
//   cost: 5,
//   illustrator: "Ricardo Gacia",
//   number: 201,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618735,
//   },
//   rarity: "rare",
// };
//
