import type { CharacterCard } from "@tcg/op-types";
import { st06MonkeyDGarp012I18n } from "./st06-012-monkey-d-garp.i18n.ts";
export const st06MonkeyDGarp012: CharacterCard = {
  id: "ST06-012",
  canonicalId: "ST06-012",
  slug: "monkey-d-garp/st06-012",
  name: "Monkey.D.Garp",
  printings: [
    {
      id: "ST06-012",
      artId: "ST06-012",
      setCode: "ST06",
      collectorNumber: "012",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST06-012.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "ST06",
  cost: 5,
  power: 6000,
  traits: ["Navy"],
  attribute: "strike",
  effect:
    "[Activate: Main] You may trash 1 card from your hand and rest this Character: K.O. up to 1 of your opponent's Characters with a cost of 4 or less.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
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
                  value: 4,
                  comparison: "lte",
                },
              ],
            },
          },
        ],
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
          {
            cost: "restThisCard",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st06MonkeyDGarp012I18n,
};
