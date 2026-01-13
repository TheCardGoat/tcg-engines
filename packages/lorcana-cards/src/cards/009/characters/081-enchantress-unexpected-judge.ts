import type { CharacterCard } from "@tcg/lorcana-types";

export const enchantressUnexpectedJudge: CharacterCard = {
  id: "mk4",
  cardType: "character",
  name: "Enchantress",
  version: "Unexpected Judge",
  fullName: "Enchantress - Unexpected Judge",
  inkType: ["emerald"],
  franchise: "Beauty and the Beast",
  set: "009",
  text: "TRUE FORM While being challenged, this character gets +2 {S}.",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 2,
  cardNumber: 81,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "514d881921a9208b5a264935feee3bf3fd6b18f7",
  },
  abilities: [],
  classifications: ["Dreamborn", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { enchantressUnexpectedJudge as enchantressUnexpectedJudgeAsOrig } from "@lorcanito/lorcana-engine/cards/002/characters/080-enchantress-unexpected-judge";
//
// export const enchantressUnexpectedJudge: LorcanitoCharacterCard = {
//   ...enchantressUnexpectedJudgeAsOrig,
//   id: "b7r",
//   reprints: [enchantressUnexpectedJudgeAsOrig.id],
//   number: 81,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650021,
//   },
// };
//
