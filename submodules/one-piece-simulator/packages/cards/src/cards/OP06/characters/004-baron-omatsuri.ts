import type { CharacterCard } from "@tcg/op-types";
import { op06BaronOmatsuri004I18n } from "./004-baron-omatsuri.i18n.ts";

export const op06BaronOmatsuri004: CharacterCard = {
  id: "OP06-004",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP06",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["FILM Omatsuri Island"],
  attribute: "ranged",
  effect: "[On Play] Play up to 1 [Lily Carnation] from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "name",
                value: "Lily Carnation",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op06BaronOmatsuri004I18n,
};
