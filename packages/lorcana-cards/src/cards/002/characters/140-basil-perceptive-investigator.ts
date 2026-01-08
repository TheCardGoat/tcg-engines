import type { CharacterCard } from "@tcg/lorcana-types";

export const basilPerceptiveInvestigator: CharacterCard = {
  id: "g8b",
  cardType: "character",
  name: "Basil",
  version: "Perceptive Investigator",
  fullName: "Basil - Perceptive Investigator",
  inkType: ["sapphire"],
  franchise: "Great Mouse Detective",
  set: "002",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 140,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "3a7f3f63e93f17ac109c273f404bb327b1e3421f",
  },
  classifications: ["Storyborn", "Hero", "Detective"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const basilPerceptiveInvestigator: LorcanitoCharacterCard = {
//   id: "j48",
//
//   name: "Basil",
//   title: "Perceptive Investigator",
//   characteristics: ["hero", "storyborn", "detective"],
//   type: "character",
//   flavour: "There is no question: something is afoot in the Great Illuminary.",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 3,
//   strength: 3,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Roger Perez",
//   number: 140,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 525243,
//   },
//   rarity: "common",
// };
//
