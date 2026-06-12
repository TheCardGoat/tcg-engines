import type { StageCard } from "@tcg/op-types";
import { op03EniesLobby098I18n } from "./098-enies-lobby.i18n.ts";

export const op03EniesLobby098: StageCard = {
  id: "OP03-098",
  cardType: "stage",
  color: ["black"],
  rarity: "C",
  setId: "OP03",
  cost: 2,
  traits: ["World Government"],
  effect:
    "[Activate:Main] You may rest this Stage: If your Leader's type includes \"CP\", give up to 1 of your opponent's Characters -2 cost during this turn. [Trigger] Play this card.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "CP",
          },
        ],
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -2,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
            },
          },
        ],
      },
    ],
  },
  i18n: op03EniesLobby098I18n,
};
