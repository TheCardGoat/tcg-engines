import type { CharacterCard } from "@tcg/op-types";
import { op05NicoRobin010I18n } from "./010-nico-robin.i18n.ts";

export const op05NicoRobin010: CharacterCard = {
  id: "OP05-010",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP05",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  effect: "[On Play] K.O. up to 1 of your opponent's Characters with 1000 power or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
                  filter: "power",
                  comparison: "lte",
                  value: 1000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op05NicoRobin010I18n,
};
