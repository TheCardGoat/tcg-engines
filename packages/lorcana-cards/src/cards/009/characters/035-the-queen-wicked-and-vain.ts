import type { CharacterCard } from "@tcg/lorcana-types";

export const theQueenWickedAndVain: CharacterCard = {
  id: "2kk",
  cardType: "character",
  name: "The Queen",
  version: "Wicked and Vain",
  fullName: "The Queen - Wicked and Vain",
  inkType: ["amethyst"],
  franchise: "Snow White",
  set: "009",
  text: "I SUMMON THEE {E} — Draw a card.",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 1,
  cardNumber: 35,
  inkable: true,
  externalIds: {
    ravensburger: "094496e1f92348975aa93f49b2bb514555b8d8d7",
  },
  abilities: [
    {
      id: "2kk-1",
      type: "activated",
      cost: {},
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
      text: "I SUMMON THEE {E} — Draw a card.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Queen"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { theQueenWickedAndVain as ogTheQueenWickedAndVain } from "@lorcanito/lorcana-engine/cards/001/characters/056-the-queen-wicked-and-vain";
//
// export const theQueenWickedAndVain: LorcanitoCharacterCard = {
//   ...ogTheQueenWickedAndVain,
//   id: "k4l",
//   reprints: [ogTheQueenWickedAndVain.id],
//   number: 35,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 649982,
//   },
// };
//
