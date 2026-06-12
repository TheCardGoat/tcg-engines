import type { CharacterCard } from "@tcg/op-types";
import { op09BoaHancockSp051I18n } from "./051-boa-hancock-sp.i18n.ts";

export const op09BoaHancockSp051: CharacterCard = {
  id: "OP07-051",
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "OP09",
  cost: 6,
  power: 8000,
  traits: ["Kuja Pirates The Seven Warlords of the Sea"],
  attribute: "special",
  effect:
    "[On Play] Up to 1 of your opponent's Characters other than [Monkey.D.Luffy] cannot attack until the end of your opponent's next turn. Then, place up to 1 Character with a cost of 1 or less at the bottom of the owner's deck.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "cannotAttack",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "excludeName",
                  value: "Monkey.D.Luffy",
                },
              ],
            },
            duration: "untilEndOfOpponentNextTurn",
          },
          {
            action: "returnToDeck",
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
                  comparison: "lte",
                  value: 1,
                },
              ],
            },
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op09BoaHancockSp051I18n,
};
