import type { CharacterCard } from "@tcg/lorcana-types";

export const shereKhanMenacingPredator: CharacterCard = {
  id: "1nj",
  cardType: "character",
  name: "Shere Khan",
  version: "Menacing Predator",
  fullName: "Shere Khan - Menacing Predator",
  inkType: ["ruby"],
  franchise: "Jungle Book",
  set: "009",
  text: "DON'T INSULT MY INTELLIGENCE Whenever one of your characters challenges another character, gain 1 lore.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 104,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d699b7284880df41462554acf1e1f68689fab0bd",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shereKhanMenacingPredator as ogShereKhanMenacingPredator } from "@lorcanito/lorcana-engine/cards/002/characters/126-shere-khan-menacing-predator";
//
// export const shereKhanMenacingPredator: LorcanitoCharacterCard = {
//   ...ogShereKhanMenacingPredator,
//   id: "nzy",
//   reprints: [ogShereKhanMenacingPredator.id],
//   number: 104,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650042,
//   },
// };
//
