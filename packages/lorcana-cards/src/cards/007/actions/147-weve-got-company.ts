import type { ActionCard } from "@tcg/lorcana-types";

export const weveGotCompany: ActionCard = {
  id: "inc",
  cardType: "action",
  name: "We've Got Company!",
  inkType: ["ruby"],
  franchise: "Atlantis",
  set: "007",
  text: "Ready all your characters. They gain Reckless this turn. (They can't quest and must challenge if able.)",
  cost: 3,
  cardNumber: 147,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "43362114455febd0d8b29de9e69a7c4841fd2ec7",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { weveGotCompanyAbility } from "@lorcanito/lorcana-engine/cards/007/abilities";
//
// export const weveGotCompany: LorcanitoActionCard = {
//   id: "vhs",
//   name: "We've Got Company!",
//   characteristics: ["action"],
//   text: "Ready all your characters. They gain Reckless this turn. (They can't quest and must challenge if able.)",
//   type: "action",
//   abilities: [weveGotCompanyAbility],
//   inkwell: false,
//   colors: ["ruby"],
//   cost: 3,
//   illustrator: "Isaiah Mesq",
//   number: 147,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619490,
//   },
//   rarity: "rare",
// };
//
