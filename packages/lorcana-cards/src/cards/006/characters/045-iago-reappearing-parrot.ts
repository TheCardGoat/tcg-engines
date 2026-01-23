import type { CharacterCard } from "@tcg/lorcana-types";

export const iagoReappearingParrot: CharacterCard = {
  id: "tre",
  cardType: "character",
  name: "Iago",
  version: "Reappearing Parrot",
  fullName: "Iago - Reappearing Parrot",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "006",
  text: "GUESS WHO When this character is banished in a challenge, return this card to your hand.",
  cost: 4,
  strength: 4,
  willpower: 2,
  lore: 1,
  cardNumber: 45,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6b429fee312a65704722d56f090cd9bbe69ea8ae",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whenThisCharacterBanishedInAChallenge } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { returnThisCardToHand } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const iagoReappearingParrot: LorcanitoCharacterCard = {
//   id: "s12",
//   name: "Iago",
//   title: "Reappearing Parrot",
//   characteristics: ["dreamborn", "ally"],
//   text: "GUESS WHO When this character is banished in a challenge, return this card to your hand.",
//   type: "character",
//   abilities: [
//     whenThisCharacterBanishedInAChallenge({
//       name: "Guess Who",
//       text: "When this character is banished in a challenge, return this card to your hand.",
//       effects: [returnThisCardToHand],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 4,
//   strength: 4,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Cam Kendell",
//   number: 45,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 592020,
//   },
//   rarity: "common",
// };
//
