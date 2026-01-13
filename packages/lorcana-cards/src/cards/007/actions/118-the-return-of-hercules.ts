import type { ActionCard } from "@tcg/lorcana-types";

export const theReturnOfHercules: ActionCard = {
  id: "nej",
  cardType: "action",
  name: "The Return of Hercules",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "007",
  text: "Each player may reveal a character card from their hand and play it for free.",
  cost: 5,
  cardNumber: 118,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "545963749a1038d0c00d90cc484c66acfc11a852",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { theReturnOfHerculesAbility } from "@lorcanito/lorcana-engine/cards/007/abilities";
//
// export const theReturnOfHercules: LorcanitoActionCard = {
//   id: "zun",
//   name: "The Return Of Hercules",
//   characteristics: ["action"],
//   text: "Each player may reveal a character card from their hand and play it for free.",
//   type: "action",
//   abilities: theReturnOfHerculesAbility,
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 5,
//   illustrator: "Kevin Sidharta",
//   number: 118,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619470,
//   },
//   rarity: "legendary",
// };
//
