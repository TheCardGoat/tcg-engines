import type { CharacterCard } from "@tcg/op-types";
import { op07BoaSandersonia050I18n } from "./050-boa-sandersonia.i18n.ts";

export const op07BoaSandersonia050: CharacterCard = {
  id: "OP07-050",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP07",
  cost: 3,
  power: 3000,
  counter: 2000,
  traits: ["Kuja Pirates"],
  attribute: "strike",
  effect:
    "[On Play] If you have 2 or more [Amazon Lily] or [Kuja Pirates] type Characters on your field, return up to 1 of your opponent's Characters with a cost of 3 or less to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "character",
            comparison: "gte",
            value: 2,
            filters: [
              {
                filter: "trait",
                value: "Amazon Lily",
              },
              {
                filter: "trait",
                value: "Kuja Pirates",
              },
            ],
          },
        ],
        actions: [
          {
            action: "returnToHand",
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
                  value: 3,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op07BoaSandersonia050I18n,
};
