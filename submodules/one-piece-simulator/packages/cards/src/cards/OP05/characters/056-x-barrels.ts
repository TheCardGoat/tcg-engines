import type { CharacterCard } from "@tcg/op-types";
import { op05XBarrels056I18n } from "./056-x-barrels.i18n.ts";

export const op05XBarrels056: CharacterCard = {
  id: "OP05-056",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP05",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Former Navy"],
  attribute: "strike",
  effect:
    "[On Play] You may place 1 of your Characters other than this Character at the bottom of your deck: Draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op05XBarrels056I18n,
};
