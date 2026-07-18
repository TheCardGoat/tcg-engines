import type { EventCard } from "@tcg/op-types";
import { op07KeepOut018I18n } from "./018-keep-out.i18n.ts";

export const op07KeepOut018: EventCard = {
  id: "OP07-018",
  canonicalId: "OP07-018",
  slug: "keep-out",
  name: "Keep Out",
  printings: [
    {
      id: "OP07-018",
      artId: "OP07-018",
      setCode: "OP07",
      collectorNumber: "018",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-018.jpg",
    },
  ],
  cardType: "event",
  color: ["red"],
  rarity: "C",
  setId: "OP07",
  cost: 1,
  traits: ["Revolutionary Army Impel Down"],
  effect:
    "[Counter] Up to 1 of your [Revolutionary Army] type Characters gains +2000 power until the end of your next turn. [Trigger] Activate this card's [Counter] effect.",
  effects: {
    effects: [
      {
        trigger: "counter",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Revolutionary Army",
                  match: "includes",
                },
              ],
            },
            value: 2000,
            duration: "untilEndOfYourNextTurn",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "activateEffect",
            effectTrigger: "counter",
          },
        ],
      },
    ],
  },
  i18n: op07KeepOut018I18n,
};
