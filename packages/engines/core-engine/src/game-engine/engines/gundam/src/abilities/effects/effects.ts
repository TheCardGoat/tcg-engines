import type { DiscardEffect, DrawEffect } from "./types";

export const discardACard: DiscardEffect = {
  type: "discard",
  amount: 1,
  target: {
    type: "card",
    value: 1,
    filters: [
      { filter: "owner", value: "self" },
      { filter: "zone", value: "hand" },
    ],
  },
};

export const drawXCard = (amount: number): DrawEffect => ({
  type: "draw",
  amount,
  target: {
    type: "player",
    value: "self",
  },
});
