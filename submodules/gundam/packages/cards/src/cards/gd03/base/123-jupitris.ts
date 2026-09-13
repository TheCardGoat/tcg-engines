import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd03Jupitris123: BaseCard = {
  cardNumber: "GD03-123",
  name: "Jupitris",
  type: "base",
  color: "blue",
  traits: ["titans", "jupitris", "warship"],
  id: "GD03-123",
  canonicalId: "GD03-123",
  externalIds: { bandai: "gundam:gd03-123" },
  slug: "jupitris/gd03-123",
  displayName: "Jupitris",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-123",
  printings: [
    {
      id: "GD03-123",
      artId: "GD03-123",
      setCode: "GD03",
      collectorNumber: "GD03-123",
      cardNumber: "GD03-123",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd03/GD03-123.webp",
      productName: "Steel Requiem[GD03]",
    },
  ],
  reprints: ["GD03-123"],
  selectedPrintingId: "GD03-123",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd03/GD03-123.webp",
  legality: "legal",
  level: 3,
  cost: 1,
  hp: 5,
  effect:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand. Then, if a friendly (Jupitris) Unit is in play, choose 1 enemy Unit that is Lv.3 or lower. Rest it.",
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
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            hasTrait: "jupitris",
          },
          thenDirectives: [
            {
              action: {
                action: "rest",
                target: {
                  owner: "opponent",
                  cardType: "unit",
                  count: 1,
                  attributeFilters: [{ attribute: "level", comparison: "lte", value: 3 }],
                },
              },
            },
          ],
        },
      ],
      sourceText:
        "【Deploy】Add 1 of your Shields to your hand. Then, if a friendly (Jupitris) Unit is in play, choose 1 enemy Unit that is Lv.3 or lower. Rest it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
