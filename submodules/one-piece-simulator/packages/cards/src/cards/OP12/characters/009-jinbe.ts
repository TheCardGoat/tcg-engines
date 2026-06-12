import type { CharacterCard } from "@tcg/op-types";
import { op12Jinbe009I18n } from "./009-jinbe.i18n.ts";

export const op12Jinbe009: CharacterCard = {
  id: "OP12-009",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP12",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Fish-Man The Sun Pirates"],
  attribute: "strike",
  effect:
    "[On Play] You may reveal 2 Events from your hand: This Character gains [Rush] during this turn. Then, this Character gains +1000 power until the end of your opponent's next End Phase.",
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
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 1000,
            duration: "untilEndOfOpponentNextEndPhase",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op12Jinbe009I18n,
};
