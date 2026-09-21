import type { EventCard } from "@tcg/op-types";
import { op15GumGumStorm095I18n } from "./op15-095-gum-gum-storm.i18n.ts";

export const op15GumGumStorm095: EventCard = {
  id: "OP15-095",
  canonicalId: "OP15-095",
  slug: "gum-gum-storm/op15-095",
  name: "Gum-Gum Storm",
  printings: [
    {
      id: "OP15-095",
      artId: "OP15-095",
      setCode: "OP15",
      collectorNumber: "095",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-095_vhlwIFk.jpg",
    },
  ],
  cardType: "event",
  color: ["black"],
  rarity: "UC",
  setId: "OP15",
  cost: 1,
  traits: ["Straw Hat Crew"],
  effect:
    "[Main] You may rest 1 of your DON!! cards: If you have 15 or more cards in your trash, up to 1 of your {Straw Hat Crew} type Leader or Character cards gains +3000 power during this turn.\n[Counter] If you have 15 or more cards in your trash, up to 1 of your Leader or Character cards gains +4000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "restDon",
            amount: 1,
          },
        ],
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
              filters: [
                {
                  filter: "trait",
                  value: "Straw Hat Crew",
                  match: "includes",
                },
              ],
            },
            value: 3000,
            duration: "thisTurn",
            condition: {
              condition: "zoneCount",
              player: "self",
              zone: "trash",
              comparison: "gte",
              value: 15,
            },
          },
        ],
        optional: true,
      },
      {
        trigger: "counter",
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "trash",
            comparison: "gte",
            value: 15,
          },
        ],
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
            value: 4000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op15GumGumStorm095I18n,
};
