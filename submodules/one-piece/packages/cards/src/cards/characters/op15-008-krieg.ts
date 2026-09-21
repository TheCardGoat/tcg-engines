import type { CharacterCard } from "@tcg/op-types";
import { op15Krieg008I18n } from "./op15-008-krieg.i18n.ts";

export const op15Krieg008: CharacterCard = {
  id: "OP15-008",
  canonicalId: "OP15-008",
  slug: "krieg/op15-008",
  name: "Krieg",
  printings: [
    {
      id: "OP15-008",
      artId: "OP15-008",
      setCode: "OP15",
      collectorNumber: "008",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-008_FODS7An.jpg",
      label: "Krieg (OP15-008)",
    },
    {
      id: "OP15-008_p1",
      artId: "OP15-008_p1",
      setCode: "OP15",
      collectorNumber: "008",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-008_p1_1nGVM5V.jpg",
      label: "Krieg (OP15-008) (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "OP15",
  cost: 8,
  power: 9000,
  traits: ["Krieg Pirates East Blue"],
  attribute: "slash",
  effect:
    "[On Play] Give up to 3 of your opponent's rested DON!! cards to 1 of your opponent's Characters. Then, this Character gains [Rush] during this turn.\n[Activate: Main] [Once Per Turn] If this Character was played on this turn, give all of your opponent's Characters -1000 power during this turn for every DON!! card given to that Character.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "giveDon",
            donorPlayer: "opponent",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 3,
              upTo: true,
            },
            donState: "rested",
          },
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
      },
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "playedThisTurn",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: "all",
              },
            },
            value: -1000,
            valuePerAttachedDonOn: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "attachedDon",
                  comparison: "gte",
                  value: 1,
                },
              ],
            },
            duration: "thisTurn",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op15Krieg008I18n,
};
