import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseTrueFriend: CharacterCard = {
  id: "19d",
  cardType: "character",
  name: "Mickey Mouse",
  version: "True Friend",
  fullName: "Mickey Mouse - True Friend",
  inkType: ["amber"],
  set: "009",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 13,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "a393e1fbe54391026a76fa1f3896c5cff218962b",
  },
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { mickeyMouseTrueFriend as ogMickeyMouseTrueFriend } from "@lorcanito/lorcana-engine/cards/001/characters/012-mickey-mouse-true-friend";
//
// export const mickeyMouseTrueFriend: LorcanitoCharacterCard = {
//   ...ogMickeyMouseTrueFriend,
//   id: "c2m",
//   reprints: [ogMickeyMouseTrueFriend.id],
//   number: 13,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 649962,
//   },
// };
//
