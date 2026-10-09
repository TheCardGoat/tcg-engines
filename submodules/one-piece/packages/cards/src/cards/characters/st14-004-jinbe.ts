import type { CharacterCard } from "@tcg/op-types";
import { st14Jinbe004I18n } from "./st14-004-jinbe.i18n.ts";
export const st14Jinbe004: CharacterCard = {
  id: "ST14-004",
  canonicalId: "ST14-004",
  slug: "jinbe/st14-004",
  name: "Jinbe",
  printings: [
    {
      id: "ST14-004",
      artId: "ST14-004",
      setCode: "ST14",
      collectorNumber: "004",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST14-004.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "ST14",
  cost: 3,
  traits: ["Fish-Man", "The Sun Pirates"],
  power: 4000,
  attribute: "strike",
  counter: 1000,
  effect:
    "[Activate: Main] [Once Per Turn] Up to 1 of your black {Straw Hat Crew} type Characters gains +2 cost until the end of your opponent's next turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "color",
                  value: "black",
                },
                {
                  filter: "trait",
                  value: "Straw Hat Crew",
                  match: "exact",
                },
              ],
            },
            value: 2,
            duration: "untilEndOfOpponentNextTurn",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: st14Jinbe004I18n,
};
