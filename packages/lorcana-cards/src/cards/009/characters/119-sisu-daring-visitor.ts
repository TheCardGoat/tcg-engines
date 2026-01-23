import type { CharacterCard } from "@tcg/lorcana-types";

export const sisuDaringVisitor: CharacterCard = {
  id: "1y1",
  cardType: "character",
  name: "Sisu",
  version: "Daring Visitor",
  fullName: "Sisu - Daring Visitor",
  inkType: ["ruby"],
  franchise: "Raya and the Last Dragon",
  set: "009",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nBRING ON THE HEAT! When you play this character, banish chosen opposing character with 1 {S} or less.",
  cost: 3,
  strength: 1,
  willpower: 1,
  lore: 1,
  cardNumber: 119,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "fc67550a3eb2e05ff941e3dd9ba390ad5570186e",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Deity", "Dragon"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { sisuDaringVisitor as sisuDaringVisitorAsOrig } from "@lorcanito/lorcana-engine/cards/004/characters/123-sisu-daring-visitor";
//
// export const sisuDaringVisitor: LorcanitoCharacterCard = {
//   ...sisuDaringVisitorAsOrig,
//   id: "eyu",
//   reprints: [sisuDaringVisitorAsOrig.id],
//   number: 119,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650055,
//   },
// };
//
