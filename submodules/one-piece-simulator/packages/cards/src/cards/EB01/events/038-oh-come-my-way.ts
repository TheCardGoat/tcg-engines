import type { EventCard } from "@tcg/op-types";
import { eb01OhComeMyWay038I18n } from "./038-oh-come-my-way.i18n.ts";

export const eb01OhComeMyWay038: EventCard = {
  id: "EB01-038",
  cardType: "event",
  color: ["purple"],
  rarity: "C",
  setId: "EB01",
  cost: 1,
  traits: ["Baroque Works"],
  effect:
    '[Counter] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): If your Leader\'s type includes "Baroque Works", select 1 of your Characters. Change the attack target to the selected Character.[Trigger] DON!! -1: Draw 2 cards.',
  effects: {
    effects: [
      {
        trigger: "trigger",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
      },
    ],
  },
  i18n: eb01OhComeMyWay038I18n,
};
