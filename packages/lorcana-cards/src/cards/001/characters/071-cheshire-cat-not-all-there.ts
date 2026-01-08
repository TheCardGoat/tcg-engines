import type { CharacterCard } from "@tcg/lorcana-types";

export const cheshireCatNotAllThere: CharacterCard = {
  id: "mmz",
  cardType: "character",
  name: "Cheshire Cat",
  version: "Not All There",
  fullName: "Cheshire Cat - Not All There",
  inkType: ["emerald"],
  franchise: "Disney",
  set: "001",
  text: "**Lose something?** When this character is challenged and banished, banish the challenging character.",
  cost: 3,
  strength: 0,
  willpower: 3,
  lore: 2,
  cardNumber: 71,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [],
  classifications: ["Storyborn"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { whenChallengedAndBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { banishChallengingCharacter } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const cheshireCat: LorcanitoCharacterCard = {
//   id: "mmz",
//
//   name: "Cheshire Cat",
//   title: "Not All There",
//   characteristics: ["storyborn"],
//   text: "**Lose something?** When this character is challenged and banished, banish the challenging character.",
//   type: "character",
//   abilities: [
//     whenChallengedAndBanished({
//       name: "Lose Something?",
//       text: "When this character is challenged and banished, banish the challenging character.",
//       effects: [banishChallengingCharacter],
//     }),
//   ],
//   flavour: '"You may have noticed that I\'m not all there myself."',
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 3,
//   willpower: 3,
//   strength: 0,
//   lore: 2,
//   illustrator: "Caner Soylu",
//   number: 71,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 492122,
//   },
//   rarity: "uncommon",
// };
//
