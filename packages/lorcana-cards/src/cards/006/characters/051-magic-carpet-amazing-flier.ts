import type { CharacterCard } from "@tcg/lorcana-types";

export const magicCarpetAmazingFlier: CharacterCard = {
  id: "kst",
  cardType: "character",
  name: "Magic Carpet",
  version: "Amazing Flier",
  fullName: "Magic Carpet - Amazing Flier",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "006",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 3,
  cardNumber: 51,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "4af7234f2f361cc2d518bc0f1bde9b379e38d192",
  },
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const magicCarpetAmazingFlier: LorcanitoCharacterCard = {
//   id: "f37",
//   name: "Magic Carpet",
//   title: "Amazing Flier",
//   characteristics: ["storyborn", "ally"],
//   type: "character",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 3,
//   strength: 1,
//   willpower: 3,
//   lore: 3,
//   illustrator: "Ron Baird",
//   number: 51,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 592026,
//   },
//   rarity: "uncommon",
// };
//
