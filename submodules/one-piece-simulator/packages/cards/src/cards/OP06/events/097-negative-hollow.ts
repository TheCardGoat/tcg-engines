import type { EventCard } from "@tcg/op-types";
import { op06NegativeHollow097I18n } from "./097-negative-hollow.i18n.ts";

export const op06NegativeHollow097: EventCard = {
  id: "OP06-097",
  cardType: "event",
  color: ["black"],
  rarity: "R",
  setId: "OP06",
  cost: 2,
  trigger: "Activate this card's [Main] effect.",
  traits: ["Thriller Bark Pirates"],
  effect: "[Main] Trash 1 card from your opponent's hand.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "trashFromHand",
            player: "opponent",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op06NegativeHollow097I18n,
};
