import type { CharacterCard } from "@tcg/lorcana-types";

export const balooLaidbackBear: CharacterCard = {
  id: "tso",
  cardType: "character",
  name: "Baloo",
  version: "Laid-Back Bear",
  fullName: "Baloo - Laid-Back Bear",
  inkType: ["emerald"],
  franchise: "Jungle Book",
  set: "010",
  cost: 2,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 69,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "6b6374259d18914f31d3bc6bdec27dcd5725e54e",
  },
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const balooLaidbackBear: LorcanitoCharacterCard = {
//   id: "jqk",
//   name: "Baloo",
//   title: "Laid-Back Bear",
//   characteristics: ["storyborn", "ally"],
//   text: "",
//   type: "character",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 2,
//   strength: 2,
//   willpower: 4,
//   illustrator: "Laura Pauselli",
//   number: 69,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659450,
//   },
//   rarity: "common",
//   abilities: [],
//   lore: 1,
// };
//
