import type { ItemCard } from "@tcg/lorcana-types";

export const theBlackCauldron: ItemCard = {
  abilities: [
    {
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
      id: "1ni-1",
      name: "THE CAULDRON CALLS",
      text: "THE CAULDRON CALLS {E}, 1 {I} — Put a character card from your discard under this item faceup.",
      type: "activated",
    },
    {
      cost: {
        exert: true,
        ink: 0,
      },
      effect: {
        type: "enable-play-from-under",
        cardType: "character",
        duration: "this-turn",
      },
      id: "1ni-2",
      name: "RISE AND JOIN ME!",
      text: "RISE AND JOIN ME! {E}, {d} {I} – This turn, you may play characters from under this item.",
      type: "activated",
    },
  ],
  cardNumber: 32,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "d59bf7b77f401b3aeb48aef1f53706b3c0bc556a",
  },
  franchise: "Black Cauldron",
  id: "1ni",
  inkType: ["amber"],
  inkable: false,
  name: "The Black Cauldron",
  set: "010",
  text: "THE CAULDRON CALLS {E}, 1 {I} — Put a character card from your discard under this item faceup.\nRISE AND JOIN ME! {E}, 1 {I} – This turn, you may play characters from under this item.",
};
