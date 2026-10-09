import type { EventCard } from "@tcg/op-types";
import { pTotMusica060I18n } from "./p-060-tot-musica.i18n.ts";
export const pTotMusica060: EventCard = {
  id: "P-060",
  canonicalId: "P-060",
  slug: "tot-musica/p-060",
  name: "Tot Musica",
  printings: [
    {
      id: "P-060",
      artId: "P-060",
      setCode: "P",
      collectorNumber: "060",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-060.png",
    },
  ],
  cardType: "event",
  color: ["green"],
  rarity: "P",
  setId: "P",
  cost: 2,
  traits: ["Music", "FILM"],
  effect: "[Main] You may rest 1 of your [Uta] cards: Rest up to 2 of your opponent's DON!! cards.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "restCards",
            amount: 1,
            filters: [
              {
                filter: "name",
                value: "Uta",
              },
            ],
          },
        ],
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["costArea"],
              count: {
                amount: 2,
                upTo: true,
              },
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: pTotMusica060I18n,
};
