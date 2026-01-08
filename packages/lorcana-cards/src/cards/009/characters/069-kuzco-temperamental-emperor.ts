import type { CharacterCard } from "@tcg/lorcana-types";

export const kuzcoTemperamentalEmperor: CharacterCard = {
  id: "1og",
  cardType: "character",
  name: "Kuzco",
  version: "Temperamental Emperor",
  fullName: "Kuzco - Temperamental Emperor",
  inkType: ["emerald"],
  franchise: "Emperors New Groove",
  set: "009",
  text: "Ward (Opponents can't choose this character except to challenge.)\nNO TOUCHY! When this character is challenged and banished, you may banish the challenging character.",
  cost: 5,
  strength: 2,
  willpower: 4,
  lore: 3,
  cardNumber: 69,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d9db9f6bf253381915cb4e979201f2ce3217677d",
  },
  abilities: [],
  classifications: ["Storyborn", "King"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { kuzcoTemperamentalEmperor as ogKuzcoTemperamentalEmperor } from "@lorcanito/lorcana-engine/cards/001/characters/084-kuzco-temperamental-emperor";
//
// export const kuzcoTemperamentalEmperor: LorcanitoCharacterCard = {
//   ...ogKuzcoTemperamentalEmperor,
//   id: "l2r",
//   reprints: [ogKuzcoTemperamentalEmperor.id],
//   number: 69,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650011,
//   },
// };
//
