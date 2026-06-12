import type { LeaderCard } from "@tcg/op-types";
import { eb02Kyros040I18n } from "./040-kyros.i18n.ts";

export const eb02Kyros040: LeaderCard = {
  id: "EB01-040",
  cardType: "leader",
  color: ["black", "yellow"],
  rarity: "L",
  setId: "EB02",
  power: 5000,
  life: 4,
  traits: ["Dressrosa"],
  attribute: "slash",
  effect:
    "[Activate: Main] [Once Per Turn] You may turn 1 card from the top of your Life cards face-up: K.O. up to 1 of your opponent's Characters with a cost of 0.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "turnLifeFaceUp",
            count: 1,
          },
        ],
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
                  filter: "cost",
                  comparison: "eq",
                  value: 0,
                },
              ],
            },
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: eb02Kyros040I18n,
};
