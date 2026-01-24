import type { ItemCard } from "@tcg/lorcana-types";

export const theNephewsPiggyBank: ItemCard = {
  id: "12r",
  cardType: "item",
  name: "The Nephews' Piggy Bank",
  inkType: ["amber"],
  set: "008",
  text: "INSIDE JOB If you have a character named Donald Duck in play, you pay 1 {I} less to play this item.\nPAYOFF {E} – Chosen character gets -1 {S} until the start of your next turn.",
  cost: 2,
  cardNumber: 44,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "8bb480d66afa05abc46b8e1acccb123b0e1426b2",
  },
  abilities: [
    {
      id: "12r-1",
      type: "action",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have a character named Donald Duck in play",
        },
        then: {
          type: "play-card",
          from: "hand",
        },
      },
      text: "INSIDE JOB If you have a character named Donald Duck in play, you pay 1 {I} less to play this item.",
    },
    {
      id: "12r-2",
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -1,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "PAYOFF {E} – Chosen character gets -1 {S} until the start of your next turn.",
    },
  ],
};
