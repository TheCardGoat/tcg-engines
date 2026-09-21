import type { EventCard } from "@tcg/op-types";
import { op17ThereSNoAuthorityInTheWorldThatLastsForever055I18n } from "./op17-055-there-s-no-authority-in-the-world-that-lasts-forever.i18n.ts";

export const op17ThereSNoAuthorityInTheWorldThatLastsForever055: EventCard = {
  id: "OP17-055",
  canonicalId: "OP17-055",
  slug: "there-s-no-authority-in-the-world-that-lasts-forever/op17-055",
  name: "There's No Authority in the World That Lasts Forever!!!",
  printings: [
    {
      id: "OP17-055",
      artId: "OP17-055",
      setCode: "OP17",
      collectorNumber: "055",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-055_gAXVxvh.jpg",
    },
  ],
  cardType: "event",
  color: ["blue"],
  rarity: "R",
  setId: "OP17",
  cost: 0,
  traits: ["Rocks Pirates"],
  effect:
    '[Main] You may rest 1 of your DON!! cards: Up to 1 of your [Rocks.D.Xebec] gains [Unblockable] during this turn.\n\n[Counter] Up to 1 of your Leader with a type including "Rocks Pirates" or up to 1 of your Character with a type including "Rocks Pirates" gains +2000 power during this battle.',
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
        optional: true,
        actions: [
          {
            action: "grantKeyword",
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
                  value: "Rocks.D.Xebec",
                },
              ],
            },
            keyword: "unblockable",
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
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Rocks Pirates",
                  match: "includes",
                },
              ],
            },
            value: 2000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op17ThereSNoAuthorityInTheWorldThatLastsForever055I18n,
};
