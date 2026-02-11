import type { ItemCard } from "@tcg/lorcana-types";

export const theNephewsPiggyBank: ItemCard = {
  abilities: [
    {
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
      id: "12r-1",
      text: "INSIDE JOB If you have a character named Donald Duck in play, you pay 1 {I} less to play this item.",
      type: "action",
    },
    {
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
