import type { CharacterCard } from "@tcg/op-types";
import { op08TashigiSp006I18n } from "./st06-006-tashigi-sp.i18n.ts";

export const op08TashigiSp006: CharacterCard = {
  id: "ST06-006",
  canonicalId: "ST06-006",
  slug: "tashigi-sp/st06-006",
  name: "Tashigi",
  printings: [
    {
      id: "ST06-006",
      artId: "ST06-006",
      setCode: "ST06",
      collectorNumber: "006",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST06-006_p2.jpg",
      label: "Tashigi (SP)",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "ST06",
  cost: 3,
  power: 4000,
  counter: 2000,
  traits: ["Navy"],
  attribute: "slash",
  effect:
    "[Activate: Main] You may rest this Character: Give up to 1 of your opponent's Characters -2 cost during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -2,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op08TashigiSp006I18n,
};
