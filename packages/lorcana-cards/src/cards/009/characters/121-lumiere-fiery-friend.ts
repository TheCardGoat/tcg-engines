import type { CharacterCard } from "@tcg/lorcana-types";

export const lumiereFieryFriend: CharacterCard = {
  id: "xyr",
  cardType: "character",
  name: "Lumiere",
  version: "Fiery Friend",
  fullName: "Lumiere - Fiery Friend",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "009",
  text: "FERVENT ADDRESS Your other characters get +1 {S}.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 121,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7a69f5139f712cc9898120eee5736b7a23f360ca",
  },
  abilities: [],
  classifications: ["Dreamborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { lumiereFieryFriend as ogLumiereFieryFriend } from "@lorcanito/lorcana-engine/cards/004/characters/113-lumiere-fiery-friend";
//
// export const lumiereFieryFriend: LorcanitoCharacterCard = {
//   ...ogLumiereFieryFriend,
//   id: "bk1",
//   reprints: [ogLumiereFieryFriend.id],
//   number: 121,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650056,
//   },
// };
//
