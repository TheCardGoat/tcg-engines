import type { LeaderCard } from "@tcg/op-types";
import { eb03NefeltariVivi001I18n } from "./001-nefeltari-vivi.i18n.ts";

export const eb03NefeltariVivi001: LeaderCard = {
  id: "EB03-001",
  canonicalId: "EB03-001",
  slug: "nefeltari-vivi/eb03-001",
  name: "Nefeltari Vivi",
  printings: [
    {
      id: "EB03-001",
      artId: "EB03-001",
      setCode: "EB03",
      collectorNumber: "001",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-001_0dBLyMa.jpg",
    },
    {
      id: "EB03-001_p1",
      artId: "EB03-001_p1",
      setCode: "EB03",
      collectorNumber: "001",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-001_p1_9CT8VHg.jpg",
    },
  ],
  cardType: "leader",
  color: ["blue", "red"],
  rarity: "L",
  setId: "EB03",
  power: 5000,
  life: 4,
  traits: ["Alabasta"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-001_p1_9CT8VHg.jpg",
      imageId: "EB03-001_p1",
    },
  ],
  effect:
    "[Once Per Turn] If your Character with a base cost of 4 or more would be K.O.'d, you may trash 1 card from your hand instead.\n[Activate: Main] You may rest this Leader: Give up to 1 of your opponent's Characters 2000 power during this turn. Then, up to 1 of your Characters without a [When Attacking] effect gains [Rush] during this turn.",
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
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 2000,
            duration: "thisTurn",
          },
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "hasEffectType",
                  value: "whenAttacking",
                  negate: true,
                },
              ],
            },
            keyword: "rush",
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
    replacementEffects: [
      {
        replacedEvent: "ko",
        eventFilter: {
          player: "self",
          filters: [{ filter: "baseCost", comparison: "gte", value: 4 }],
        },
        replacementAction: {
          action: "trashFromHand",
          player: "self",
          amount: 1,
        },
        oncePerTurn: true,
      },
    ],
  },
  i18n: eb03NefeltariVivi001I18n,
};
