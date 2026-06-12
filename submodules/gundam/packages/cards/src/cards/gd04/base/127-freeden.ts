import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd04Freeden127: BaseCard = {
  cardNumber: "GD04-127",
  name: "Freeden Ⅱ",
  type: "base",
  traits: ["vulture", "warship"],
  id: "GD04-127",
  externalId: "gundam:gd04-127",
  slug: "freeden-gd04-127",
  displayName: "Freeden Ⅱ",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-127",
  printings: [
    {
      id: "GD04-127",
      collectorNumber: "GD04-127",
      cardNumber: "GD04-127",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-127.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-127.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-127",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-127.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-127.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  hp: 5,
  effect:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand. Then, if there are 7 or more (Vulture) cards in your trash, choose 1 enemy Unit with 2 or less AP. Destroy it.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "deploySelf",
          },
        },
      ],
      sourceText: "【Burst】Deploy this card.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "addShieldToHand",
            count: 1,
          },
        },
        {
          condition: {
            type: "cardInZone",
            owner: "friendly",
            zone: "trash",
            comparison: "gte",
            count: 7,
            hasTrait: "vulture",
          },
          thenDirectives: [
            {
              action: {
                action: "destroy",
                target: {
                  owner: "opponent",
                  cardType: "unit",
                  attributeFilters: [{ attribute: "ap", comparison: "lte", value: 2 }],
                  count: 1,
                },
              },
            },
          ],
        },
      ],
      sourceText:
        "【Deploy】Add 1 of your Shields to your hand. Then, if there are 7 or more (Vulture) cards in your trash, choose 1 enemy Unit with 2 or less AP. Destroy it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
