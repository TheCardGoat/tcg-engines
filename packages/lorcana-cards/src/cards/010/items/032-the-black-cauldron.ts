import type { ItemCard } from "@tcg/lorcana-types";

export const theBlackCauldron: ItemCard = {
  id: "1ni",
  cardType: "item",
  name: "The Black Cauldron",
  inkType: ["amber"],
  franchise: "Black Cauldron",
  set: "010",
  text: "THE CAULDRON CALLS {E}, 1 {I} — Put a character card from your discard under this item faceup.\nRISE AND JOIN ME! {E}, 1 {I} – This turn, you may play characters from under this item.",
  cost: 3,
  cardNumber: 32,
  inkable: false,
  externalIds: {
    ravensburger: "d59bf7b77f401b3aeb48aef1f53706b3c0bc556a",
  },
  abilities: [
    {
      id: "1ni-1",
      text: "THE CAULDRON CALLS {E}, 1 {I} — Put a character card from your discard under this item faceup.",
      name: "THE CAULDRON CALLS",
      type: "activated",
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        type: "put-under",
        source: "discard",
        under: "self",
        cardType: "character",
      },
    },
    {
      id: "1ni-2",
      text: "RISE AND JOIN ME! {E}, {d} {I} – This turn, you may play characters from under this item.",
      name: "RISE AND JOIN ME!",
      type: "activated",
      cost: {
        exert: true,
        ink: 0,
      },
      effect: {
        type: "enable-play-from-under",
        cardType: "character",
        duration: "this-turn",
      },
    },
  ],
};
