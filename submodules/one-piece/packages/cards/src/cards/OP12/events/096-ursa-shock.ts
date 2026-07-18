import type { EventCard } from "@tcg/op-types";
import { op12UrsaShock096I18n } from "./096-ursa-shock.i18n.ts";

export const op12UrsaShock096: EventCard = {
  id: "OP12-096",
  canonicalId: "OP12-096",
  slug: "ursa-shock",
  name: "Ursa Shock",
  printings: [
    {
      id: "OP12-096",
      artId: "OP12-096",
      setCode: "OP12",
      collectorNumber: "096",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-096_aSd4d9r.jpg",
    },
  ],
  cardType: "event",
  color: ["black"],
  rarity: "C",
  setId: "OP12",
  cost: 4,
  trigger: "Draw 1 card and trash 1 card from the top of your deck.",
  traits: ["Revolutionary Army The Seven Warlords of the Sea"],
  effect:
    "[Main] K.O. up to 1 of your opponent's Characters with a cost of 4 or less. If you have a Character with a cost of 8 or more, you may select your opponent's Character with a cost of 6 or less instead.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
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
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
            condition: {
              condition: "notHasCard",
              player: "self",
              zone: "character",
              filters: [
                {
                  filter: "cost",
                  comparison: "gte",
                  value: 8,
                },
              ],
            },
          },
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
                  comparison: "lte",
                  value: 6,
                },
              ],
            },
            condition: {
              condition: "hasCard",
              player: "self",
              zone: "character",
              filters: [
                {
                  filter: "cost",
                  comparison: "gte",
                  value: 8,
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
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "trashFromDeck",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op12UrsaShock096I18n,
};
