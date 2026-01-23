import type { CharacterCard } from "@tcg/lorcana-types";

export const kingHubertPhillipsFather: CharacterCard = {
  id: "1yf",
  cardType: "character",
  name: "King Hubert",
  version: "Phillip's Father",
  fullName: "King Hubert - Phillip's Father",
  inkType: ["steel"],
  franchise: "Sleeping Beauty",
  set: "006",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 179,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "fdcba78caf061cf899339fe10c21acc175bf2c6a",
  },
  classifications: ["Storyborn", "Mentor", "King"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const kingHubertPhillipsFather: LorcanitoCharacterCard = {
//   id: "q63",
//   name: "King Hubert",
//   title: "Phillip's Father",
//   characteristics: ["storyborn", "mentor", "king"],
//   type: "character",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 3,
//   strength: 3,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Gaku Kumatori",
//   number: 179,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 587756,
//   },
//   rarity: "common",
// };
//
