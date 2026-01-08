import type { CharacterCard } from "@tcg/lorcana-types";

export const torFlorist: CharacterCard = {
  id: "hsq",
  cardType: "character",
  name: "Tor",
  version: "Florist",
  fullName: "Tor - Florist",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "004",
  cost: 5,
  strength: 4,
  willpower: 7,
  lore: 1,
  cardNumber: 91,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "402556072df095be47408c9b2240053e919333e0",
  },
  classifications: ["Dreamborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const torFlorist: LorcanitoCharacterCard = {
//   id: "g1b",
//   name: "Tor",
//   title: "Florist",
//   characteristics: ["dreamborn", "ally"],
//   type: "character",
//   flavour:
//     "They say that his arrangements are exquisite, \nHis composites and bouquets are so divine. \nBut when the crowds try to come and visit, \nThere's always quite a fight to form a line.",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 5,
//   strength: 4,
//   willpower: 7,
//   lore: 1,
//   illustrator: "Anderson Mahanski",
//   number: 91,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 547775,
//   },
//   rarity: "common",
// };
//
