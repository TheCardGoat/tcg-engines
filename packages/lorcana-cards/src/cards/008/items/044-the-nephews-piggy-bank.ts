import type { ItemCard } from "@tcg/lorcana-types";

export const theNephewsPiggyBank: ItemCard = {
  abilities: [
    {
      effect: {
        condition: {
          expression: "you have a character named Donald Duck in play",
          type: "if",
        },
        then: {
          from: "hand",
          type: "play-card",
        },
        type: "conditional",
      },
      id: "12r-1",
      text: "INSIDE JOB If you have a character named Donald Duck in play, you pay 1 {I} less to play this item.",
      type: "action",
    },
    {
      effect: {
        modifier: -1,
        stat: "strength",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "modify-stat",
      },
      id: "12r-2",
      text: "PAYOFF {E} – Chosen character gets -1 {S} until the start of your next turn.",
      type: "action",
    },
  ],
  cardNumber: 44,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "8bb480d66afa05abc46b8e1acccb123b0e1426b2",
  },
  id: "12r",
  inkType: ["amber"],
  inkable: false,
  missingTests: true,
  name: "The Nephews' Piggy Bank",
  set: "008",
  text: "INSIDE JOB If you have a character named Donald Duck in play, you pay 1 {I} less to play this item.\nPAYOFF {E} – Chosen character gets -1 {S} until the start of your next turn.",
};
