import type { CharacterCard } from "@tcg/lorcana-types";

export const luisaMadrigalMagicallyStrongOne: CharacterCard = {
  id: "1rs",
  cardType: "character",
  name: "Luisa Madrigal",
  version: "Magically Strong One",
  fullName: "Luisa Madrigal - Magically Strong One",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "009",
  text: "Rush (This character can challenge the turn they're played.)",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 1,
  cardNumber: 58,
  inkable: false,
  externalIds: {
    ravensburger: "e5dd22ae0e83e9f520522e07643858b4e2d081e7",
  },
  abilities: [
    {
      id: "1rs-1",
      type: "keyword",
      keyword: "Rush",
      text: "Rush",
    },
  ],
  classifications: ["Storyborn", "Ally", "Madrigal"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { luisaMadrigalMagicallyStrongOne as ogLuisaMadrigalMagicallyStrongOne } from "@lorcanito/lorcana-engine/cards/004/characters/047-luisa-madrigal-magically-strong-one";
//
// export const luisaMadrigalMagicallyStrongOne: LorcanitoCharacterCard = {
//   ...ogLuisaMadrigalMagicallyStrongOne,
//   id: "utw",
//   reprints: ["kcf"],
//   number: 58,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650002,
//   },
// };
//
