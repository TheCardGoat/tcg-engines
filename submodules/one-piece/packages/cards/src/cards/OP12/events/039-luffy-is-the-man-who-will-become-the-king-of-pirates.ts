import type { EventCard } from "@tcg/op-types";
import { op12LuffyIsTheManWhoWillBecomeTheKingOfPirates039I18n } from "./039-luffy-is-the-man-who-will-become-the-king-of-pirates.i18n.ts";

export const op12LuffyIsTheManWhoWillBecomeTheKingOfPirates039: EventCard = {
  id: "OP12-039",
  canonicalId: "OP12-039",
  slug: "luffy-is-the-man-who-will-become-the-king-of-pirates",
  name: "Luffy Is the Man Who Will Become the King of Pirates!!!",
  printings: [
    {
      id: "OP12-039",
      artId: "OP12-039",
      setCode: "OP12",
      collectorNumber: "039",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-039_yJsfGbX.jpg",
    },
  ],
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
              filters: [
                {
                  filter: "name",
                  value: "Roronoa Zoro",
                },
              ],
            },
          },
        ],
      },
      {
        trigger: "trigger",
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
  i18n: op12LuffyIsTheManWhoWillBecomeTheKingOfPirates039I18n,
};
