import type { ActionCard } from "@tcg/lorcana-types/cards/card-types";

export const friendsOnTheOtherSide: ActionCard = {
  id: "rrg",
  cardType: "action",
  name: "Friends On The Other Side",
  version: "",
  fullName: "Friends On The Other Side",
  inkType: [
    "amethyst",
  ],
  franchise: "General",
  set: "001",
  text: "_(A character with cost 3 or more can {E} to sing this song for free.)_
Draw 2 cards.",
  cost: 3,
  cardNumber: 64,
  inkable: true,
  rarity: "common",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 494100,
  },
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
          type: "draw",
          amount: 2,
          target: {
            ref: "controller",
          },
        },
      id: "rrg-1",
      text: "Draw 2 cards.",
    },
  ],
};
