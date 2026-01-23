import type { CharacterCard } from "@tcg/lorcana-types";

export const theQueenRegalMonarch: CharacterCard = {
  id: "1tz",
  cardType: "character",
  name: "The Queen",
  version: "Regal Monarch",
  fullName: "The Queen - Regal Monarch",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "009",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 7,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "edc8d296f601e44b6311621379644a538907c472",
  },
  classifications: ["Storyborn", "Villain", "Queen"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { theQueenRegalMonarch as ogTheQueenRegalMonarch } from "@lorcanito/lorcana-engine/cards/002/characters/027-the-queen-regal-monarch";
//
// export const theQueenRegalMonarch: LorcanitoCharacterCard = {
//   ...ogTheQueenRegalMonarch,
//   id: "ifu",
//   reprints: [ogTheQueenRegalMonarch.id],
//   number: 7,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 649956,
//   },
// };
//
