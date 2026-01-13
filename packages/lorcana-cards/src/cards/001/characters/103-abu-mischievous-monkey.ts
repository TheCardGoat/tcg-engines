import type { CharacterCard } from "@tcg/lorcana-types";

export const abuMischievousMonkey: CharacterCard = {
  id: "mz8",
  cardType: "character",
  name: "Abu",
  version: "Mischievous Monkey",
  fullName: "Abu - Mischievous Monkey",
  inkType: ["ruby"],
  franchise: "Aladdin",
  set: "001",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 2,
  cardNumber: 103,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "52d0e83a0a5688158a89ac1eb53cde7bc4755a38",
  },
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const abuMischievenusMonkey: LorcanitoCharacterCard = {
//   id: "pbo",
//   name: "Abu",
//   title: "Mischievous Monkey",
//   illustrator: "Oleg Yurkov",
//   characteristics: ["storyborn", "ally"],
//   type: "character",
//   flavour:
//     "Someday, Abu, things are gonna change. We'll be rich, live in a palace, and never have any problems at all.\n−Aladdin",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 3,
//   strength: 3,
//   willpower: 2,
//   lore: 2,
//   number: 103,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 507461,
//   },
//   rarity: "common",
// };
//
