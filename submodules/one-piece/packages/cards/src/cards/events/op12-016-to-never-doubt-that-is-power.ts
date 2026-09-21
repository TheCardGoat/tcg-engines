import type { EventCard } from "@tcg/op-types";
import { op12ToNeverDoubtThatIsPower016I18n } from "./op12-016-to-never-doubt-that-is-power.i18n.ts";

export const op12ToNeverDoubtThatIsPower016: EventCard = {
  id: "OP12-016",
  canonicalId: "OP12-016",
  slug: "to-never-doubt-that-is-power/op12-016",
  name: "To Never Doubt--That Is Power!",
  printings: [
    {
      id: "OP12-016",
      artId: "OP12-016",
      setCode: "OP12",
      collectorNumber: "016",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-016_C8vnOuE.jpg",
    },
  ],
  cardType: "event",
  color: ["red"],
  rarity: "C",
  setId: "OP12",
  cost: 0,
  traits: ["Former Roger Pirates"],
  effect:
    "[Main] You may give 2 active DON!! cards to 1 of your [Silvers Rayleigh]: Your opponent cannot activate [Blocker] when the card given these DON!! cards attacks during this turn.\n[Counter] Up to 1 of your Characters or [Silvers Rayleigh] gains +2000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "giveDon",
            amount: 2,
          },
        ],
        optional: true,
        actions: [
          {
            action: "cannotActivate",
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
                  value: "Silvers Rayleigh",
                },
              ],
            },
            keyword: "blocker",
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "counter",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 2000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op12ToNeverDoubtThatIsPower016I18n,
};
