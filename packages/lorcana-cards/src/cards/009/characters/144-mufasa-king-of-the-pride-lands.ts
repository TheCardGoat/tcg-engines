import type { CharacterCard } from "@tcg/lorcana-types";

export const mufasaKingOfThePrideLands: CharacterCard = {
  id: "1l9",
  cardType: "character",
  name: "Mufasa",
  version: "King of the Pride Lands",
  fullName: "Mufasa - King of the Pride Lands",
  inkType: ["sapphire"],
  franchise: "Lion King",
  set: "009",
  cost: 6,
  strength: 4,
  willpower: 6,
  lore: 3,
  cardNumber: 144,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "ce63a503da81e5566193b8b840955f4ac9517ea3",
  },
  classifications: ["Storyborn", "Mentor", "King"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { mufasaKingOfProudLands as mufasaKingOfThePrideLandsAsOrig } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
//
// export const mufasaKingOfThePrideLands: LorcanitoCharacterCard = {
//   ...mufasaKingOfThePrideLandsAsOrig,
//   id: "adw",
//   reprints: [mufasaKingOfThePrideLandsAsOrig.id],
//   number: 144,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650079,
//   },
// };
//
