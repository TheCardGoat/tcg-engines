import type { ActionCard } from "@tcg/lorcana-types";

export const grabYourSword: ActionCard = {
  id: "fa7",
  cardType: "action",
  name: "Grab Your Sword",
  inkType: ["steel"],
  franchise: "Beauty and the Beast",
  set: "001",
  text: "Deal 2 damage to each opposing character.",
  actionSubtype: "song",
  cost: 5,
  cardNumber: 198,
  inkable: false,
  externalIds: {
    ravensburger: "371502073092025bab3c49038c7809151c636ad4",
  },
  abilities: [
    {
      id: "fa7-1",
      text: "Deal 2 damage to each opposing character.",
      type: "action",
      effect: {
        type: "deal-damage",
        amount: 2,
        target: "ALL_OPPOSING_CHARACTERS",
      },
    },
  ],
};
