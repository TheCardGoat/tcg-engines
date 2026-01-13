import type { CharacterCard } from "@tcg/lorcana-types";

export const megaraPullingTheStrings: CharacterCard = {
  id: "wy2",
  cardType: "character",
  name: "Megara",
  version: "Pulling the Strings",
  fullName: "Megara - Pulling the Strings",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "009",
  text: "WONDER BOY When you play this character, chosen character gets +2 {S} this turn.",
  cost: 2,
  strength: 2,
  willpower: 1,
  lore: 1,
  cardNumber: 79,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "76be007752f1625ad8261741ec543a1ef1682a2c",
  },
  abilities: [],
  classifications: ["Dreamborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { megaraPullingTheStrings as ogMegaraPullingTheStrings } from "@lorcanito/lorcana-engine/cards/001/characters/087-megara-pulling-the-strings";
//
// export const megaraPullingTheStrings: LorcanitoCharacterCard = {
//   ...ogMegaraPullingTheStrings,
//   id: "g7m",
//   reprints: ["kv6"],
//   number: 79,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650019,
//   },
// };
//
