import type { ActionCard } from "@tcg/lorcana-types/cards/card-types";

export const reflection: ActionCard = {
  id: "brz",
  cardType: "action",
  name: "Reflection",
  version: "",
  fullName: "Reflection",
  inkType: [
    "amethyst",
  ],
  franchise: "General",
  set: "001",
  text: "_(A character with cost 2 or more can {E} to sing this
song for free.)_
Look at the top 3 cards of your deck. Put them back on the top of your deck in any order.",
  cost: 1,
  cardNumber: 65,
  inkable: true,
  rarity: "common",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 506113,
  },
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
          type: "look-at-cards",
          amount: 3,
          from: "top-of-deck",
          target: "CONTROLLER",
        },
      id: "brz-1",
      text: "Look at the top 3 cards of your deck. Put them back on the top of your deck in any order.",
    },
  ],
};
