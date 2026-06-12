import type { CharacterCard } from "@tcg/op-types";
import { op12Ipponmatsu021I18n } from "./021-ipponmatsu.i18n.ts";

export const op12Ipponmatsu021: CharacterCard = {
  id: "OP12-021",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP12",
  cost: 3,
  power: 0,
  counter: 1000,
  traits: ["East Blue"],
  attribute: "wisdom",
  effect:
    "If your Leader has the (Slash) attribute and you have 6 or more rested DON!! cards, this Character cannot be rested by your opponent's effects.[Blocker]",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op12Ipponmatsu021I18n,
};
