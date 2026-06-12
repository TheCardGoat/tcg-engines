import type { EventCard } from "@tcg/op-types";
import { op12LuffyIsTheManWhoWillBecomeTheKingOfPirates039I18n } from "./039-luffy-is-the-man-who-will-become-the-king-of-pirates.i18n.ts";

export const op12LuffyIsTheManWhoWillBecomeTheKingOfPirates039: EventCard = {
  id: "OP12-039",
  cardType: "event",
  color: ["green"],
  rarity: "R",
  setId: "OP12",
  cost: 3,
  trigger: "Up to 1 of your Leader or Character cards gains +1000 power during this turn.",
  traits: ["Straw Hat Crew"],
  effect: "[Main] Set your [Roronoa Zoro] Leader as active.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
          },
        ],
      },
    ],
  },
  i18n: op12LuffyIsTheManWhoWillBecomeTheKingOfPirates039I18n,
};
