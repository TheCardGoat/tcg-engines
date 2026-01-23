import type { CharacterCard } from "@tcg/lorcana-types";

export const rafikiShamanOfTheSavanna: CharacterCard = {
  id: "1x5",
  cardType: "character",
  name: "Rafiki",
  version: "Shaman of the Savanna",
  fullName: "Rafiki - Shaman of the Savanna",
  inkType: ["amethyst"],
  franchise: "Lion King",
  set: "006",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 42,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "fc3769ff0bfc5273b01c299d10e4e87eb766b81d",
  },
  classifications: ["Storyborn", "Mentor", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const rafikiShamanOfTheSavanna: LorcanitoCharacterCard = {
//   id: "fwf",
//   name: "Rafiki",
//   title: "Shaman of the Savanna",
//   characteristics: ["storyborn", "mentor", "sorcerer"],
//   type: "character",
//   abilities: [],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 1,
//   strength: 2,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Giulia Riva",
//   number: 42,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 587269,
//   },
//   rarity: "common",
// };
//
