import type { CharacterCard } from "@tcg/lorcana-types";

export const rayaHeadstrong: CharacterCard = {
  id: "1jb",
  cardType: "character",
  name: "Raya",
  version: "Headstrong",
  fullName: "Raya - Headstrong",
  inkType: ["ruby"],
  franchise: "Raya and the Last Dragon",
  set: "009",
  text: "NOTE TO SELF, DON'T DIE During your turn, whenever this character banishes another character in a challenge, you may ready this character. If you do, she can't quest for the rest of this turn.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 127,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c75d35692903d3cf6571ffe9cf34ca6854cb779e",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { rayaHeadstrong as rayaHeadstrongAsOrig } from "@lorcanito/lorcana-engine/cards/002/characters/122-raya-headstrong";
//
// export const rayaHeadstrong: LorcanitoCharacterCard = {
//   ...rayaHeadstrongAsOrig,
//   id: "g6t",
//   reprints: [rayaHeadstrongAsOrig.id],
//   number: 127,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650062,
//   },
// };
//
