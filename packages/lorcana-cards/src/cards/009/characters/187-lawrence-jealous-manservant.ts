import type { CharacterCard } from "@tcg/lorcana-types";

export const lawrenceJealousManservant: CharacterCard = {
  id: "1rx",
  cardType: "character",
  name: "Lawrence",
  version: "Jealous Manservant",
  fullName: "Lawrence - Jealous Manservant",
  inkType: ["steel"],
  franchise: "Princess and the Frog",
  set: "009",
  text: "PAYBACK While this character has no damage, he gets +4 {S}.",
  cost: 3,
  strength: 0,
  willpower: 4,
  lore: 2,
  cardNumber: 187,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e673e28c8e84ee6a6a337c7ec4008fd12e0ff908",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { lawrenceJealousManservant as lawrenceJealousManservantAsOrig } from "@lorcanito/lorcana-engine/cards/002/characters/186-lawrence-jealous-manservant";
//
// export const lawrenceJealousManservant: LorcanitoCharacterCard = {
//   ...lawrenceJealousManservantAsOrig,
//   id: "b85",
//   reprints: [lawrenceJealousManservantAsOrig.id],
//   number: 187,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650120,
//   },
// };
//
