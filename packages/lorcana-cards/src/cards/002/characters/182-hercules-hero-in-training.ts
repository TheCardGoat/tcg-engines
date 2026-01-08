import type { CharacterCard } from "@tcg/lorcana-types";

export const herculesHeroInTraining: CharacterCard = {
  id: "19e",
  cardType: "character",
  name: "Hercules",
  version: "Hero in Training",
  fullName: "Hercules - Hero in Training",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "002",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 182,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "a2a32240189369d4a32fbbfdb9b7c6d163511eb6",
  },
  classifications: ["Storyborn", "Hero", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const herculesHeroInTraining: LorcanitoCharacterCard = {
//   id: "keh",
//
//   name: "Hercules",
//   title: "Hero in Training",
//   characteristics: ["hero", "storyborn", "prince"],
//   type: "character",
//   flavour: "No need to call IX-I-I!",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 2,
//   strength: 2,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Eva Widermann",
//   number: 182,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527774,
//   },
//   rarity: "common",
// };
//
