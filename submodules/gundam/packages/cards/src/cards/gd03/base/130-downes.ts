import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd03Downes130: BaseCard = {
  cardNumber: "GD03-130",
  name: "Downes",
  type: "base",
  traits: ["vagan", "stronghold"],
  id: "GD03-130",
  externalId: "gundam:gd03-130",
  slug: "downes-gd03-130",
  displayName: "Downes",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-130",
  printings: [
    {
      id: "GD03-130",
      collectorNumber: "GD03-130",
      cardNumber: "GD03-130",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-130.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-130.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-130",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-130.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-130.webp?260424",
  legality: "legal",
  level: 5,
  cost: 2,
  hp: 5,
  effect:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand. Then, if it is your turn, you may choose 1 (Vagan) Unit card that is Lv.4 or lower from your trash. Pay its cost to deploy it.",
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
            type: "isTurn",
            whose: "friendly",
          },
          thenDirectives: [
            {
              optional: true,
              action: {
                action: "deployFromTrash",
                levelAtMost: 4,
                payCost: true,
                target: {
                  owner: "friendly",
                  cardType: "unit",
                  zone: "trash",
                  count: 1,
                  attributeFilters: [
                    {
                      attribute: "trait",
                      comparison: "includes",
                      value: "vagan",
                    },
                    {
                      attribute: "level",
                      comparison: "lte",
                      value: 4,
                    },
                  ],
                },
              },
            },
          ],
        },
      ],
      sourceText:
        "【Deploy】Add 1 of your Shields to your hand. Then, if it is your turn, you may choose 1 (Vagan) Unit card that is Lv.4 or lower from your trash. Pay its cost to deploy it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
