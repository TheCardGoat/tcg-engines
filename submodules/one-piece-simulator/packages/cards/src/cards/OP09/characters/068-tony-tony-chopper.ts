import type { CharacterCard } from "@tcg/op-types";
import { op09TonyTonyChopper068I18n } from "./068-tony-tony-chopper.i18n.ts";

export const op09TonyTonyChopper068: CharacterCard = {
  id: "OP09-068",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP09",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Animal Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[End of Your Turn] You may return 1 or more DON!! cards from your field to your DON!! deck: Set this Character as active. Then, this Character gains [Blocker] until the end of your opponent's next turn.",
  effects: {
    effects: [
      {
        trigger: "endOfYourTurn",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
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
            keyword: "blocker",
            duration: "untilEndOfOpponentNextTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op09TonyTonyChopper068I18n,
};
