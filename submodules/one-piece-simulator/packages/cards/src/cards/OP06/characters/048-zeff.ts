import type { CharacterCard } from "@tcg/op-types";
import { op06Zeff048I18n } from "./048-zeff.i18n.ts";

export const op06Zeff048: CharacterCard = {
  id: "OP06-048",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP06",
  cost: 3,
  power: 3000,
  counter: 1000,
  traits: ["East Blue"],
  attribute: "strike",
  effect:
    "[Your Turn] When your opponent activates [Blocker] or an Event, if your Leader has the [East Blue] type, you may trash 4 cards from the top of your deck.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "whenBlockerActivated",
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
          {
            action: "trashFromDeck",
            player: "self",
            amount: 4,
          },
        ],
      },
    ],
  },
  i18n: op06Zeff048I18n,
};
