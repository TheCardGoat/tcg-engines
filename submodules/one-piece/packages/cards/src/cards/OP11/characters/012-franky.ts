import type { CharacterCard } from "@tcg/op-types";
import { op11Franky012I18n } from "./012-franky.i18n.ts";

export const op11Franky012: CharacterCard = {
  id: "OP11-012",
  canonicalId: "OP11-012",
  slug: "franky/op11-012",
  name: "Franky",
  printings: [
    {
      id: "OP11-012",
      artId: "OP11-012",
      setCode: "OP11",
      collectorNumber: "012",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-012.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP11",
  cost: 4,
  power: 4000,
  counter: 2000,
  traits: ["Navy SWORD"],
  attribute: "strike",
  effect:
    "[Your Turn] [Once Per Turn] When your opponent activates an Event, all of your Characters gain +2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "whenOpponentActivatesEvent",
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op11Franky012I18n,
};
