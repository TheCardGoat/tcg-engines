import type { EventCard } from "@tcg/op-types";
import { op03TempestKickSkySlicer096I18n } from "./096-tempest-kick-sky-slicer.i18n.ts";

export const op03TempestKickSkySlicer096: EventCard = {
  id: "OP03-096",
  canonicalId: "OP03-096",
  slug: "tempest-kick-sky-slicer",
  name: "Tempest Kick Sky Slicer",
  printings: [
    {
      id: "OP03-096",
      artId: "OP03-096",
      setCode: "OP03",
      collectorNumber: "096",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-096.jpg",
    },
  ],
  cardType: "event",
  color: ["black"],
  rarity: "UC",
  setId: "OP03",
  cost: 2,
  traits: ["CP9"],
  effect:
    "[Main] K.O. up to 1 of your opponent's Characters with a cost of 0 or your opponent's Stages with a cost of 3 or less. [Trigger] Draw 2 cards.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "choice",
            options: [
              [
                {
                  action: "ko",
                  target: {
                    player: "opponent",
                    zones: ["character"],
                    count: {
                      amount: 1,
                      upTo: true,
                    },
                    filters: [
                      {
                        filter: "cost",
                        comparison: "eq",
                        value: 0,
                      },
                    ],
                  },
                },
              ],
              [
                {
                  action: "ko",
                  target: {
                    player: "opponent",
                    zones: ["stage"],
                    count: {
                      amount: 1,
                      upTo: true,
                    },
                    filters: [
                      {
                        filter: "cost",
                        comparison: "lte",
                        value: 3,
                      },
                    ],
                  },
                },
              ],
            ],
          },
        ],
      },
      {
        trigger: "trigger",
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
  i18n: op03TempestKickSkySlicer096I18n,
};
