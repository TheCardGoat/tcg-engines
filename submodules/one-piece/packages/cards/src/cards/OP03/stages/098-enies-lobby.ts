import type { StageCard } from "@tcg/op-types";
import { op03EniesLobby098I18n } from "./098-enies-lobby.i18n.ts";

export const op03EniesLobby098: StageCard = {
  id: "OP03-098",
  canonicalId: "OP03-098",
  slug: "enies-lobby",
  name: "Enies Lobby",
  printings: [
    {
      id: "OP03-098",
      artId: "OP03-098",
      setCode: "OP03",
      collectorNumber: "098",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-098.jpg",
    },
  ],
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
            condition: {
              condition: "leaderTrait",
              trait: "CP",
              match: "includes",
            },
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "playThisCard",
          },
        ],
      },
    ],
  },
  i18n: op03EniesLobby098I18n,
};
