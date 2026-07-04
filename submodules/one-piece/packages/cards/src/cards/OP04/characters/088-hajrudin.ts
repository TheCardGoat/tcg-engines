import type { CharacterCard } from "@tcg/op-types";
import { op04Hajrudin088I18n } from "./088-hajrudin.i18n.ts";

export const op04Hajrudin088: CharacterCard = {
  id: "OP04-088",
  canonicalId: "OP04-088",
  slug: "hajrudin/op04-088",
  name: "Hajrudin",
  printings: [
    {
      id: "OP04-088",
      artId: "OP04-088",
      setCode: "OP04",
      collectorNumber: "088",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-088.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP04",
  cost: 6,
  power: 7000,
  counter: 1000,
  traits: ["Giant New Giant Pirate Crew Dressrosa"],
  attribute: "strike",
  effect:
    "[Activate:Main] You may rest your 1 Leader: Give up to 1 of your opponent's Characters -4 cost during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
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
            value: -4,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op04Hajrudin088I18n,
};
