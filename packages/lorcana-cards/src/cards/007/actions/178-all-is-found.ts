import type { ActionCard } from "@tcg/lorcana-types";

export const allIsFound: ActionCard = {
  id: "138",
  cardType: "action",
  name: "All Is Found",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "007",
  text: "Put up to 2 cards from your discard into your inkwell, facedown and exerted.",
  actionSubtype: "song",
  cost: 5,
  cardNumber: 178,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8e20c469e5bfb01717b1a29a7ed5e2e22d5d0694",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { allIsFoundAbility } from "@lorcanito/lorcana-engine/cards/007/abilities";
//
// export const allIsFound: LorcanitoActionCard = {
//   id: "prl",
//   name: "All Is Found",
//   characteristics: ["song", "action"],
//   text: "Put up to 2 cards from your discard into your inkwell, facedown and exerted.",
//   type: "action",
//   abilities: [allIsFoundAbility],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 5,
//   illustrator: "Kiyaa Jaspri",
//   number: 178,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619509,
//   },
//   rarity: "rare",
// };
//
