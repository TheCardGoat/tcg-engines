import type { CharacterCard } from "@tcg/lorcana-types";

export const galeWindSpirit: CharacterCard = {
  id: "1u4",
  cardType: "character",
  name: "Gale",
  version: "Wind Spirit",
  fullName: "Gale - Wind Spirit",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "005",
  text: "RECURRING GUST When this character is banished in a challenge, return this card to your hand.",
  cost: 3,
  strength: 1,
  willpower: 2,
  lore: 2,
  cardNumber: 42,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ee97b532e414172bb38c8157f657b9cd0e101f22",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whenThisCharacterBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { returnThisCardToHand } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const galeWindSpirit: LorcanitoCharacterCard = {
//   id: "coq",
//   name: "Gale",
//   title: "Wind Spirit",
//   characteristics: ["storyborn", "ally"],
//   text: "**RECURRING GUST** When this character is banished, return this card to your hand.",
//   type: "character",
//   abilities: [
//     whenThisCharacterBanished({
//       name: "Recurring Gust",
//       text: "When this character is banished, return this card to your hand.",
//       effects: [returnThisCardToHand],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 3,
//   strength: 1,
//   willpower: 2,
//   lore: 2,
//   illustrator: "Amber Kommavongsa",
//   number: 42,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561488,
//   },
//   rarity: "common",
// };
//
