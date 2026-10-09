import type { LeaderCard } from "@tcg/op-types";
import { st05Shanks001I18n } from "./st05-001-shanks.i18n.ts";

export const st05Shanks001: LeaderCard = {
  id: "ST05-001",
  canonicalId: "ST05-001",
  slug: "shanks/st05-001",
  name: "Shanks",
  printings: [
    {
      id: "ST05-001",
      artId: "ST05-001",
      setCode: "ST05",
      collectorNumber: "001",
      rarity: "L",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST05-001.png",
    },
  ],
  cardType: "leader",
  color: ["purple"],
  rarity: "L",
  setId: "ST05",
  power: 5000,
  life: 5,
  traits: ["FILM", "The Four Emperors", "Red-Haired Pirates"],
  attribute: "slash",
  effect:
    "[Activate: Main] [Once Per Turn] DON!! −3 (You may return the specified number of DON!! cards from your field to your DON!! deck.): All of your {FILM} type Characters gain +2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "returnDon",
            amount: 3,
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
              filters: [
                {
                  filter: "trait",
                  value: "FILM",
                  match: "exact",
                },
              ],
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: st05Shanks001I18n,
};
