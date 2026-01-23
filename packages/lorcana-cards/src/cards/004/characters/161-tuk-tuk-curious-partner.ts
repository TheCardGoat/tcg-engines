import type { CharacterCard } from "@tcg/lorcana-types";

export const tukTukCuriousPartner: CharacterCard = {
  id: "xox",
  cardType: "character",
  name: "Tuk Tuk",
  version: "Curious Partner",
  fullName: "Tuk Tuk - Curious Partner",
  inkType: ["sapphire"],
  franchise: "Raya and the Last Dragon",
  set: "004",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 161,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "796e3ba27b40636c46b51f8702e8b0a0dcb4df08",
  },
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const tukTukCuriousPartner: LorcanitoCharacterCard = {
//   id: "un6",
//   name: "Tuk Tuk",
//   title: "Curious Partner",
//   characteristics: ["storyborn", "ally"],
//   type: "character",
//   flavour: "Some say he's easily distracted. They're not wrong . . .\"\n−Raya",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 2,
//   strength: 2,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Oggy Christiansson",
//   number: 161,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550613,
//   },
//   rarity: "common",
// };
//
