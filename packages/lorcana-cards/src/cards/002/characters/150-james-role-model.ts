import type { CharacterCard } from "@tcg/lorcana-types";

export const jamesRoleModel: CharacterCard = {
  id: "1l7",
  cardType: "character",
  name: "James",
  version: "Role Model",
  fullName: "James - Role Model",
  inkType: ["sapphire"],
  franchise: "Princess and the Frog",
  set: "002",
  text: "NEVER, EVER LOSE SIGHT When this character is banished, you may put this card into your inkwell facedown and exerted.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 150,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "cdf205a53c5799da903a61cbd2d7679484a1306c",
  },
  abilities: [],
  classifications: ["Storyborn", "Mentor"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { whenThisCharacterBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { putThisCardIntoYourInkwellExerted } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const jamesRoleModel: LorcanitoCharacterCard = {
//   id: "seq",
//   name: "James",
//   title: "Role Model",
//   characteristics: ["storyborn", "mentor"],
//   text: "**NEVER, EVER LOSE SIGHT** When this character is banished, you may put this card into your inkwell facedown and exerted.",
//   type: "character",
//   abilities: [
//     whenThisCharacterBanished({
//       name: "Never, Ever Lose Sight",
//       text: "When this character is banished, you may put this card into your inkwell facedown and exerted.",
//       optional: true,
//       effects: [putThisCardIntoYourInkwellExerted],
//     }),
//   ],
//   colors: ["sapphire"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Kevin Hong",
//   number: 150,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527764,
//   },
//   rarity: "common",
// };
//
