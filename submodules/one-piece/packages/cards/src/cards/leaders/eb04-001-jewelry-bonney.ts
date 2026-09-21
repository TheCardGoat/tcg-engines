import type { LeaderCard } from "@tcg/op-types";
import { eb04JewelryBonney001I18n } from "./eb04-001-jewelry-bonney.i18n.ts";

export const eb04JewelryBonney001: LeaderCard = {
  id: "EB04-001",
  canonicalId: "EB04-001",
  slug: "jewelry-bonney/eb04-001",
  name: "Jewelry Bonney",
  printings: [
    {
      id: "EB04-001",
      artId: "EB04-001",
      setCode: "EB04",
      collectorNumber: "001",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-001.jpg",
      label: "Jewelry Bonney (EB04-001)",
    },
    {
      id: "EB04-001_p1",
      artId: "EB04-001_p1",
      setCode: "EB04",
      collectorNumber: "001",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-001_p1.jpg",
      label: "Jewelry Bonney (EB04-001) (Alternate Art)",
    },
  ],
  cardType: "leader",
  color: ["red", "yellow"],
  rarity: "L",
  setId: "EB04",
  power: 5000,
  life: 4,
  traits: ["Bonney Pirates Egghead"],
  attribute: "special",
  effect:
    "[Opponent's Turn] If you have 1 or less Life cards, this Leader gains +2000 power. [Activate: Main] [Once Per Turn] Give up to 1 of your opponent's Characters -1000 power during this turn. Then, if you have 2 or more Life cards, you may add 1 card from the top of your Life cards to your hand.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -1000,
            duration: "thisTurn",
          },
          {
            action: "removeFromLife",
            player: "self",
            count: {
              amount: 1,
            },
            destination: "hand",
            position: "top",
            condition: {
              condition: "lifeCount",
              player: "self",
              comparison: "gte",
              value: 2,
            },
          },
        ],
        oncePerTurn: true,
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 1,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: "all",
              },
              self: true,
            },
            value: 2000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: eb04JewelryBonney001I18n,
};
