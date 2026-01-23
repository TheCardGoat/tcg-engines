import type { CharacterCard } from "@tcg/lorcana-types";

export const auroraTranquilPrincess: CharacterCard = {
  id: "1sr",
  cardType: "character",
  name: "Aurora",
  version: "Tranquil Princess",
  fullName: "Aurora - Tranquil Princess",
  inkType: ["sapphire"],
  franchise: "Sleeping Beauty",
  set: "009",
  text: "Ward (Opponents can't choose this character except to challenge.)",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 154,
  inkable: true,
  externalIds: {
    ravensburger: "067bc768bc6b0221356cb0b7535f6bf9fced1949",
  },
  abilities: [
    {
      id: "1sr-1",
      type: "keyword",
      keyword: "Ward",
      text: "Ward",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { auroraTranquilPrincess as auroraTranquilPrincessAsOrig } from "@lorcanito/lorcana-engine/cards/004/characters/141-aurora-tranquil-princess";
//
// export const auroraTranquilPrincess: LorcanitoCharacterCard = {
//   ...auroraTranquilPrincessAsOrig,
//   id: "u0u",
//   reprints: [auroraTranquilPrincessAsOrig.id],
//   number: 154,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650089,
//   },
// };
//
