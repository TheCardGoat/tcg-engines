import type { CharacterCard } from "@tcg/lorcana-types";

export const cheshireCatNotAllThere: CharacterCard = {
  abilities: [],
  cardNumber: 71,
  cardType: "character",
  classifications: ["Storyborn"],
  cost: 3,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Cheshire Cat - Not All There",
  id: "mmz",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  name: "Cheshire Cat",
  set: "001",
  strength: 0,
  text: "**Lose something?** When this character is challenged and banished, banish the challenging character.",
  version: "Not All There",
  willpower: 3,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { whenChallengedAndBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import { banishChallengingCharacter } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const cheshireCat: LorcanitoCharacterCard = {
//   Id: "mmz",
//
//   Name: "Cheshire Cat",
//   Title: "Not All There",
//   Characteristics: ["storyborn"],
//   Text: "**Lose something?** When this character is challenged and banished, banish the challenging character.",
//   Type: "character",
//   Abilities: [
//     WhenChallengedAndBanished({
//       Name: "Lose Something?",
//       Text: "When this character is challenged and banished, banish the challenging character.",
//       Effects: [banishChallengingCharacter],
//     }),
//   ],
//   Flavour: '"You may have noticed that I\'m not all there myself."',
//   Inkwell: true,
//   Colors: ["emerald"],
//   Cost: 3,
//   Willpower: 3,
//   Strength: 0,
//   Lore: 2,
//   Illustrator: "Caner Soylu",
//   Number: 71,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 492122,
//   },
//   Rarity: "uncommon",
// };
//
