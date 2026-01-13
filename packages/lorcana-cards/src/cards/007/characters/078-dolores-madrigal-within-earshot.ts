import type { CharacterCard } from "@tcg/lorcana-types";

export const doloresMadrigalWithinEarshot: CharacterCard = {
  id: "1wr",
  cardType: "character",
  name: "Dolores Madrigal",
  version: "Within Earshot",
  fullName: "Dolores Madrigal - Within Earshot",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "007",
  text: "I HEAR YOU Whenever one of your characters sings a song, chosen opponent reveals their hand.",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 78,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f7ca2bca88c3d51f863bc2d006117959a66f603a",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Madrigal"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { wheneverOneOfYourCharactersSings } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { opponentRevealHand } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const doloresMadrigalWithinEarshot: LorcanitoCharacterCard = {
//   id: "b3f",
//   name: "Dolores Madrigal",
//   title: "Within Earshot",
//   characteristics: ["storyborn", "ally", "madrigal"],
//   text: "I HEAR YOU Whenever one of your characters sings a song, chosen opponent reveals their hand.",
//   type: "character",
//   abilities: [
//     wheneverOneOfYourCharactersSings({
//       name: "I HEAR YOU",
//       text: "Whenever one of your characters sings a song, chosen opponent reveals their hand.",
//       effects: [opponentRevealHand],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 1,
//   strength: 1,
//   willpower: 2,
//   illustrator: "Samantha Erdini",
//   number: 78,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619447,
//   },
//   rarity: "common",
//   lore: 1,
// };
//
