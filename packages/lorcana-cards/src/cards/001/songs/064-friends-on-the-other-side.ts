import type { ActionCard } from "@tcg/lorcana-types";

export const FriendsOnTheOtherSideUndefined: ActionCard = {
  id: "rrg",
  cardType: "action",
  name: "Friends On The Other Side",
  version: "undefined",
  fullName: "Friends On The Other Side - undefined",
  inkType: ["amethyst"],
  franchise: "Disney",
  set: "001",
  text: "_(A character with cost 3 or more can {E} to sing this song \rfor free.)_\n\rDraw 2 cards.",
  cost: 3,
  actionSubtype: "song",
  cardNumber: 64,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "_(A character with cost 3 or more can {E} to sing this song \rfor free.)_\n\rDraw 2 cards.",
      id: "rrg-1",
      effect: {
        type: "draw",
        amount: 2,
        target: "CONTROLLER",
      },
    },
  ],
  classifications: ["action", "song"],
};
