import type { CharacterCard } from "@tcg/lorcana-types";

export const pegasusGiftForHercules: CharacterCard = {
  id: "1fc",
  cardType: "character",
  name: "Pegasus",
  version: "Gift for Hercules",
  fullName: "Pegasus - Gift for Hercules",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "009",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
  cardNumber: 84,
  inkable: true,
  externalIds: {
    ravensburger: "b9041d1ca62abbd3a21d0c6f7bf65471865b0da4",
  },
  abilities: [
    {
      id: "1fc-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { pegasusGiftForHercules as pegasusGiftForHerculesAsOrig } from "@lorcanito/lorcana-engine/cards/004/characters/084-pegasus-gift-for-hercules";
//
// export const pegasusGiftForHercules: LorcanitoCharacterCard = {
//   ...pegasusGiftForHerculesAsOrig,
//   id: "w64",
//   reprints: [pegasusGiftForHerculesAsOrig.id],
//   number: 84,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650024,
//   },
// };
//
