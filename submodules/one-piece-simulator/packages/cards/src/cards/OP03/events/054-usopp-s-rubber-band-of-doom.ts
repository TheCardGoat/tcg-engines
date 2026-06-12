import type { EventCard } from "@tcg/op-types";
import { op03UsoppSRubberBandOfDoom054I18n } from "./054-usopp-s-rubber-band-of-doom.i18n.ts";

export const op03UsoppSRubberBandOfDoom054: EventCard = {
  id: "OP03-054",
  cardType: "event",
  color: ["blue"],
  rarity: "C",
  setId: "OP03",
  cost: 1,
  traits: ["Straw Hat Crew East Blue"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +2000 power during this battle. Then, you may trash 1 card from the top of your deck. [Trigger] Draw 1 card and you may trash 1 card from the top of your deck.  This card has been officially errata'd.",
  effects: {
    effects: [
      {
        trigger: "counter",
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
            value: 2000,
            duration: "thisBattle",
          },
          {
            action: "trashFromDeck",
            player: "self",
            amount: 1,
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "trashFromDeck",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op03UsoppSRubberBandOfDoom054I18n,
};
