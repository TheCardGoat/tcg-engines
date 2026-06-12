import type { CharacterCard } from "@tcg/op-types";
import { op05RobLucciSp092I18n } from "./092-rob-lucci-sp.i18n.ts";

export const op05RobLucciSp092: CharacterCard = {
  id: "OP03-092",
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "OP05",
  cost: 6,
  power: 7000,
  traits: ["CP9"],
  attribute: "strike",
  effect:
    '[On Play] You may place 2 cards with a type including "CP" from your trash at the bottom of your deck in any order: This Character gains [Rush] during this turn. (This card can attack on the turn in which it is played.)',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "rush",
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op05RobLucciSp092I18n,
};
