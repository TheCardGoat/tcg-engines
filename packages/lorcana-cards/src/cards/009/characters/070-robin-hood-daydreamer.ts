import type { CharacterCard } from "@tcg/lorcana-types";

export const robinHoodDaydreamer: CharacterCard = {
  id: "1lp",
  cardType: "character",
  name: "Robin Hood",
  version: "Daydreamer",
  fullName: "Robin Hood - Daydreamer",
  inkType: ["emerald"],
  franchise: "Robin Hood",
  set: "009",
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 4,
  cardNumber: 70,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "cffe4dfd796687f7fbed18d0f4fa3c51068d4900",
  },
  classifications: ["Dreamborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { robinHoodDaydreamer as ogRobinHoodDaydreamer } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
//
// export const robinHoodDaydreamer: LorcanitoCharacterCard = {
//   ...ogRobinHoodDaydreamer,
//   id: "x4m",
//   reprints: [ogRobinHoodDaydreamer.id],
//   number: 70,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650012,
//   },
// };
//
