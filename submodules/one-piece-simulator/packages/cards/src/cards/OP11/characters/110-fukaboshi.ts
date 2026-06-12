import type { CharacterCard } from "@tcg/op-types";
import { op11Fukaboshi110I18n } from "./110-fukaboshi.i18n.ts";

export const op11Fukaboshi110: CharacterCard = {
  id: "OP11-110",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP11",
  cost: 3,
  power: 5000,
  traits: ["Merfolk Fish-Man Island"],
  attribute: "slash",
  effect:
    "If this Character would be K.O.'d, you may rest 1 of your [Fish-Man Island] or your [Shirahoshi] Leader instead.\n[On Play] You may add 1 card from the top or bottom of your Life cards to your hand: K.O. up to 1 of your opponent's Characters with a cost of 1 or less.",
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
                  filter: "cost",
                  comparison: "lte",
                  value: 1,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op11Fukaboshi110I18n,
};
