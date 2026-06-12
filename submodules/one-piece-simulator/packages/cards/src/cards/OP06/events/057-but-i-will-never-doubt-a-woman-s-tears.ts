import type { EventCard } from "@tcg/op-types";
import { op06ButIWillNeverDoubtAWomanSTears057I18n } from "./057-but-i-will-never-doubt-a-woman-s-tears.i18n.ts";

export const op06ButIWillNeverDoubtAWomanSTears057: EventCard = {
  id: "OP06-057",
  cardType: "event",
  color: ["blue"],
  rarity: "C",
  setId: "OP06",
  cost: 1,
  trigger: "Play up to 1 Character card with a cost of 2 from your hand.",
  traits: ["Straw Hat Crew Dressrosa"],
  effect:
    "[Main] Up to 1 of your Leader or Character cards gains +1000 power during this turn. Then, reveal 1 card from the top of your deck, play up to 1 Character card with a cost of 2, and place the rest at the top or bottom of your deck.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op06ButIWillNeverDoubtAWomanSTears057I18n,
};
