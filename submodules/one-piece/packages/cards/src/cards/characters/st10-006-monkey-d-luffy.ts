import type { CharacterCard } from "@tcg/op-types";
import { st10MonkeyDLuffy006I18n } from "./st10-006-monkey-d-luffy.i18n.ts";
export const st10MonkeyDLuffy006: CharacterCard = {
  id: "ST10-006",
  canonicalId: "ST10-006",
  slug: "monkey-d-luffy/st10-006",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "ST10-006",
      artId: "ST10-006",
      setCode: "ST10",
      collectorNumber: "006",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST10-006.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "ST10",
  cost: 10,
  power: 11000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[Rush] (This card can attack on the turn in which it is played.) [Once Per Turn] When your opponent activates a [Blocker], K.O. up to 1 of your opponent's Characters with 8000 power or less.",
  effects: {
    keywords: ["rush"],
    effects: [
      {
        trigger: "whenBlockerActivated",
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
                  value: 8000,
                },
              ],
            },
          },
        ],
        oncePerTurn: true,
        eventFilter: {
          player: "opponent",
        },
      },
    ],
  },
  i18n: st10MonkeyDLuffy006I18n,
};
