import type { CharacterCard } from "@tcg/lorcana-types";

export const mushuBragginDragon: CharacterCard = {
  id: "1rk",
  cardType: "character",
  name: "Mushu",
  version: "Braggin' Dragon",
  fullName: "Mushu - Braggin' Dragon",
  inkType: ["amethyst"],
  franchise: "Mulan",
  set: "010",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 2,
  cardNumber: 46,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "e52036adb795f301a821d78c2ba527eae343a403",
  },
  classifications: ["Storyborn", "Ally", "Dragon"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const mushuBragginDragon: LorcanitoCharacterCard = {
//   id: "c1f",
//   name: "Mushu",
//   title: "Braggin' Dragon",
//   characteristics: ["storyborn", "ally", "dragon"],
//   text: "",
//   type: "character",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 4,
//   strength: 4,
//   willpower: 4,
//   illustrator: "Giorgio Di Santo",
//   number: 46,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 660001,
//   },
//   rarity: "common",
//   abilities: [],
//   lore: 2,
// };
//
