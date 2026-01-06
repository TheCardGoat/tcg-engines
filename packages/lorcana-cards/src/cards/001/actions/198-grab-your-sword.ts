import type { ActionCard } from "@tcg/lorcana-types/cards/card-types";

export const grabYourSword: ActionCard = {
  id: "u4k",
  cardType: "action",
  name: "Grab Your Sword",
  version: "",
  fullName: "Grab Your Sword",
  inkType: [
    "steel",
  ],
  franchise: "General",
  set: "001",
  text: "_(A character with cost 5 or more can {E} to sing this song for free.)_
Deal 2 damage to each opposing character.",
  cost: 5,
  cardNumber: 198,
  rarity: "rare",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 503469,
  },
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
          type: "deal-damage",
          amount: 2,
          target: "CHOSEN_CHARACTER",
        },
      id: "u4k-1",
      text: "Deal 2 damage to each opposing character.",
    },
  ],
};
