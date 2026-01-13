import type { CharacterCard } from "@tcg/lorcana-types";

export const yzmaTransformedKitten: CharacterCard = {
  id: "192",
  cardType: "character",
  name: "Yzma",
  version: "Transformed Kitten",
  fullName: "Yzma - Transformed Kitten",
  inkType: ["amethyst"],
  franchise: "Emperors New Groove",
  set: "007",
  text: "I WIN When this character is banished, if you have more cards in your hand than each opponent, you may return this card to your hand.",
  cost: 2,
  strength: 2,
  willpower: 1,
  lore: 1,
  cardNumber: 59,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a338053c5fc78cd2976092628447d8a80725dbad",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { haveMoreCardsThanOpponent } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenThisCharacterBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const yzmaChangedIntoAKitten: LorcanitoCharacterCard = {
//   id: "ol1",
//   name: "Yzma",
//   title: "Transformed Kitten",
//   characteristics: ["storyborn", "villain", "mage"],
//   text: "I WON When this character is banished, if you have more cards in hand than any opponent, you may return this character to your hand.",
//   type: "character",
//   abilities: [
//     whenThisCharacterBanished({
//       name: "I WON",
//       text: "When this character is banished, if you have more cards in hand than any opponent, you may return this character to your hand.",
//       optional: true,
//       conditions: [haveMoreCardsThanOpponent],
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: thisCharacter,
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 2,
//   strength: 2,
//   willpower: 1,
//   illustrator: "Oospognant",
//   number: 59,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619437,
//   },
//   rarity: "common",
//   lore: 1,
// };
//
