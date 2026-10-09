import type { LeaderCard } from "@tcg/op-types";
import { st04Kaido001I18n } from "./st04-001-kaido.i18n.ts";

export const st04Kaido001: LeaderCard = {
  id: "ST04-001",
  canonicalId: "ST04-001",
  slug: "kaido/st04-001",
  name: "Kaido",
  printings: [
    {
      id: "ST04-001",
      artId: "ST04-001",
      setCode: "ST04",
      collectorNumber: "001",
      rarity: "L",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST04-001.png",
    },
  ],
  cardType: "leader",
  color: ["purple"],
  rarity: "L",
  setId: "ST04",
  life: 5,
  traits: ["The Four Emperors", "Animal Kingdom Pirates"],
  power: 5000,
  attribute: "strike",
  effect:
    "[Activate: Main] [Once Per Turn] DON!! −7 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Trash up to 1 of your opponent's Life cards.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        optional: true,
        costs: [
          {
            cost: "returnDon",
            amount: 7,
          },
        ],
        actions: [
          {
            action: "removeFromLife",
            player: "opponent",
            count: {
              amount: 1,
              upTo: true,
            },
            destination: "trash",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: st04Kaido001I18n,
};
