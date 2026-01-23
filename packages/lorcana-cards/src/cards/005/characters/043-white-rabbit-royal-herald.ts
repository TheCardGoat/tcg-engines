import type { CharacterCard } from "@tcg/lorcana-types";

export const whiteRabbitRoyalHerald: CharacterCard = {
  id: "1m6",
  cardType: "character",
  name: "White Rabbit",
  version: "Royal Herald",
  fullName: "White Rabbit - Royal Herald",
  inkType: ["amethyst"],
  franchise: "Alice in Wonderland",
  set: "005",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 43,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "d25e463a72b570a5a6cd876b38749e5e28add26d",
  },
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const whiteRabbitRoyalHerald: LorcanitoCharacterCard = {
//   id: "xbh",
//   name: "White Rabbit",
//   title: "Royal Herald",
//   characteristics: ["storyborn", "ally"],
//   type: "character",
//   flavour:
//     '"Oh me, oh my! Did a piece just fall off the Illuminary?! I’ve got to tell someone before it’s too late, late, late!"',
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 3,
//   strength: 3,
//   willpower: 4,
//   lore: 1,
//   illustrator: "James C Mulligan",
//   number: 43,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561166,
//   },
//   rarity: "common",
// };
//
