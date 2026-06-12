import type { CharacterCard } from "@tcg/op-types";
import { op10Moocy043I18n } from "./043-moocy.i18n.ts";

export const op10Moocy043: CharacterCard = {
  id: "OP10-043",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP10",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Animal Dressrosa"],
  attribute: "strike",
  effect:
    '[On Play] You may rest 1 of your "Dressrosa" type Leader or Stage cards: Up to 1 of your [Monkey.D.Luffy] Characters gains [Banish] during this turn.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "restCards",
            amount: 1,
            filters: [
              {
                filter: "trait",
                value: "Dressrosa",
              },
              {
                filter: "cardCategory",
                value: "leader",
              },
              {
                filter: "cardCategory",
                value: "stage",
              },
            ],
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "name",
                  value: "Monkey.D.Luffy",
                },
              ],
            },
            keyword: "banish",
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op10Moocy043I18n,
};
