import type { CharacterCard } from "@tcg/op-types";
import { op11Camie102I18n } from "./102-camie.i18n.ts";

export const op11Camie102: CharacterCard = {
  id: "OP11-102",
  canonicalId: "OP11-102",
  slug: "camie/op11-102",
  name: "Camie",
  printings: [
    {
      id: "OP11-102",
      artId: "OP11-102",
      setCode: "OP11",
      collectorNumber: "102",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-102.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP11",
  cost: 1,
  power: 1000,
  counter: 2000,
  traits: ["Merfolk Fish-Man Island"],
  attribute: "wisdom",
  effect:
    "[Your Turn] [Once Per Turn] This effect can be activated when your opponent activates an Event or [Trigger]. If your opponent has 2 or more Life cards, trash 1 card from the top of each of your and your opponent's Life cards.",
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
            action: "removeFromLife",
            player: "self",
            count: {
              amount: 1,
            },
            destination: "trash",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op11Camie102I18n,
};
