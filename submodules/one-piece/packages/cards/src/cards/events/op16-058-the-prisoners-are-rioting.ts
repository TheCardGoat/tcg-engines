import type { EventCard } from "@tcg/op-types";
import { op16ThePrisonersAreRioting058I18n } from "./op16-058-the-prisoners-are-rioting.i18n.ts";

export const op16ThePrisonersAreRioting058: EventCard = {
  id: "OP16-058",
  canonicalId: "OP16-058",
  slug: "the-prisoners-are-rioting/op16-058",
  name: "The Prisoners Are Rioting!!",
  printings: [
    {
      id: "OP16-058",
      artId: "OP16-058",
      setCode: "OP16",
      collectorNumber: "058",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-058_vdZ9ufh.jpg",
    },
  ],
  cardType: "event",
  color: ["blue"],
  rarity: "R",
  setId: "OP16",
  cost: 1,
  traits: ["Impel Down"],
  effect:
    "[Main] If you have 10 DON!! cards on your field, all of your [Prisoner of Impel Down] cards' base power becomes 7000 during this turn.\n[Counter] Up to 1 of your [Buggy] gains +4000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "donFieldCount",
            player: "self",
            comparison: "gte",
            value: 10,
          },
        ],
        actions: [
          {
            action: "setBasePower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "name",
                  value: "Prisoner of Impel Down",
                },
              ],
            },
            value: 7000,
            duration: "thisTurn",
          },
        ],
      },
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
                  filter: "name",
                  value: "Buggy",
                },
              ],
            },
            value: 4000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op16ThePrisonersAreRioting058I18n,
};
