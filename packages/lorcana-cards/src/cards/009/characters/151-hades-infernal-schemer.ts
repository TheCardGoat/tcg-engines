import type { CharacterCard } from "@tcg/lorcana-types";

export const hadesInfernalSchemer: CharacterCard = {
  id: "12a",
  cardType: "character",
  name: "Hades",
  version: "Infernal Schemer",
  fullName: "Hades - Infernal Schemer",
  inkType: ["sapphire"],
  franchise: "Hercules",
  set: "009",
  text: "IS THERE A DOWNSIDE TO THIS? When you play this character, you may put chosen opposing character into their player's inkwell facedown.",
  cost: 7,
  strength: 3,
  willpower: 6,
  lore: 2,
  cardNumber: 151,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "89f9ee7889da4ebacb49419bd4b8dae4220a5c7c",
  },
  abilities: [],
  classifications: ["Dreamborn", "Villain", "Deity"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { hadesInfernalSchemer as hadesInfernalSchemerAsOrig } from "@lorcanito/lorcana-engine/cards/001/characters/147-hades-infernal-schemer";
//
// export const hadesInfernalSchemer: LorcanitoCharacterCard = {
//   ...hadesInfernalSchemerAsOrig,
//   id: "a03",
//   reprints: [hadesInfernalSchemerAsOrig.id],
//   number: 151,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650086,
//   },
// };
//
