import type { EventCard } from "@tcg/op-types";
import { prb02OhComeMyWayPirateFoil038I18n } from "./038-oh-come-my-way-pirate-foil.i18n.ts";

export const prb02OhComeMyWayPirateFoil038: EventCard = {
  id: "EB01-038",
  cardType: "event",
  color: ["purple"],
  rarity: "C",
  setId: "PRB02",
  cost: 1,
  traits: ["Baroque Works"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-038_r1.jpg",
      imageId: "EB01-038",
    },
  ],
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
  i18n: prb02OhComeMyWayPirateFoil038I18n,
};
