import type { CharacterCard } from "@tcg/lorcana-types";

export const simbaScrappyCub: CharacterCard = {
  id: "1e0",
  cardType: "character",
  name: "Simba",
  version: "Scrappy Cub",
  fullName: "Simba - Scrappy Cub",
  inkType: ["ruby"],
  franchise: "Lion King",
  set: "009",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 3,
  cardNumber: 105,
  inkable: false,
  vanilla: true,
  externalIds: {
    ravensburger: "b436bb8ce948a9539f8ff990a98d60b02b0a1b99",
  },
  classifications: ["Storyborn", "Hero", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { simbaScrappyCub as ogSimbaScrappyCub } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
//
// export const simbaScrappyCub: LorcanitoCharacterCard = {
//   ...ogSimbaScrappyCub,
//   id: "bt1",
//   reprints: [ogSimbaScrappyCub.id],
//   number: 105,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650043,
//   },
// };
//
