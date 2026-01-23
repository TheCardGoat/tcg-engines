import type { CharacterCard } from "@tcg/lorcana-types";

export const viranaFangChief: CharacterCard = {
  id: "1xq",
  cardType: "character",
  name: "Virana",
  version: "Fang Chief",
  fullName: "Virana - Fang Chief",
  inkType: ["emerald"],
  franchise: "Raya and the Last Dragon",
  set: "009",
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 2,
  cardNumber: 82,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "fb59ea3d5974b3dc636e39a74b0d35c27ce3b5cd",
  },
  classifications: ["Storyborn", "Villain", "Queen"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { viranaFangChief as ogViranaFangChief } from "@lorcanito/lorcana-engine/cards/002/characters/095-virana-fang-chief";
//
// export const viranaFangChief: LorcanitoCharacterCard = {
//   ...ogViranaFangChief,
//   id: "q5j",
//   reprints: ["ryo"],
//   number: 82,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650022,
//   },
// };
//
