import type { CharacterCard } from "@tcg/lorcana-types";

export const orvilleAlbatrossAir: CharacterCard = {
  id: "1jn",
  cardType: "character",
  name: "Orville",
  version: "Albatross Air",
  fullName: "Orville - Albatross Air",
  inkType: ["steel"],
  franchise: "Rescuers",
  set: "007",
  text: "WELCOME ABOARD, FOLKS During your turn, while you have a character named Miss Bianca or Bernard in play, this character gains Evasive. (They can challenge characters with Evasive.)",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  cardNumber: 194,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c89b02a8c5ef092f289aafd2dc51de65961e2f18",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { duringYourTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { whileYouHaveACharacterNamedThisCharGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const orvilleAlbatrossAir: LorcanitoCharacterCard = {
//   id: "a0j",
//   name: "Orville",
//   title: "Albatross Air",
//   characteristics: ["storyborn", "ally"],
//   text: "WELCOME ABOARD, FOLKS During your turn, while you have a character named Miss Bianca or Bernard in play, this character gains Evasive.",
//   type: "character",
//   abilities: [
//     whileYouHaveACharacterNamedThisCharGains({
//       name: "Welcome Aboard, Folks",
//       text: "During your turn, while you have a character named Miss Bianca or Bernard in play, this character gains Evasive.",
//       characterName: "Miss Bianca",
//       ability: evasiveAbility,
//       conditions: [duringYourTurn],
//     }),
//     whileYouHaveACharacterNamedThisCharGains({
//       name: "Welcome Aboard, Folks",
//       text: "During your turn, while you have a character named Miss Bianca or Bernard in play, this character gains Evasive.",
//       characterName: "Bernard",
//       ability: evasiveAbility,
//       conditions: [duringYourTurn],
//     }),
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 3,
//   strength: 4,
//   willpower: 3,
//   illustrator: "Rudy Hill",
//   number: 194,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618729,
//   },
//   rarity: "common",
//   lore: 1,
// };
//
