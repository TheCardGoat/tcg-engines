import type { CharacterCard } from "@tcg/lorcana-types";

export const mamaOdieMysticalMaven: CharacterCard = {
  id: "1gz",
  cardType: "character",
  name: "Mama Odie",
  version: "Mystical Maven",
  fullName: "Mama Odie - Mystical Maven",
  inkType: ["sapphire"],
  franchise: "Princess and the Frog",
  set: "009",
  text: "THIS GOING TO BE GOOD Whenever you play a song, you may put the top card of your deck into your inkwell facedown and exerted.",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 152,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "bef7418632eb34baeafeaecab51aad74cb7191b3",
  },
  abilities: [],
  classifications: ["Storyborn", "Mentor"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { mamaOdieMysticalMaven as mamaOdieMysticalMavenAsOrig } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
//
// export const mamaOdieMysticalMaven: LorcanitoCharacterCard = {
//   ...mamaOdieMysticalMavenAsOrig,
//   id: "j6p",
//   reprints: [mamaOdieMysticalMavenAsOrig.id],
//   number: 152,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650087,
//   },
// };
//
