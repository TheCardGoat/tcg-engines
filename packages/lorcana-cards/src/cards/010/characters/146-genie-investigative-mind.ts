import type { CharacterCard } from "@tcg/lorcana-types";

export const genieInvestigativeMind: CharacterCard = {
  id: "1vx",
  cardType: "character",
  name: "Genie",
  version: "Investigative Mind",
  fullName: "Genie - Investigative Mind",
  inkType: ["sapphire"],
  franchise: "Aladdin",
  set: "010",
  cost: 5,
  strength: 4,
  willpower: 7,
  lore: 2,
  cardNumber: 146,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "f4c80dc1a58a51da86ee4c1c6f90c46bf3ea6fed",
  },
  classifications: ["Storyborn", "Ally", "Detective"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const genieInvestigativeMind: LorcanitoCharacterCard = {
//   id: "uey",
//   name: "Genie",
//   title: "Investigative Mind",
//   characteristics: ["storyborn", "ally", "detective"],
//   text: "",
//   type: "character",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 5,
//   strength: 4,
//   willpower: 7,
//   illustrator: "Veronica Di Lorenzo / Livio Cacciatore",
//   number: 146,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659382,
//   },
//   rarity: "common",
//   abilities: [],
//   lore: 2,
// };
//
