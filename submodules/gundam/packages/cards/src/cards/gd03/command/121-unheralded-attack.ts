import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd03UnheraldedAttack121: CommandCard = {
  cardNumber: "GD03-121",
  name: "Unheralded Attack",
  type: "command",
  color: "white",
  traits: ["aeug", "newtype"],
  id: "GD03-121",
  externalId: "gundam:gd03-121",
  slug: "unheralded-attack-gd03-121",
  displayName: "Unheralded Attack",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-121",
  printings: [
    {
      id: "GD03-121",
      collectorNumber: "GD03-121",
      cardNumber: "GD03-121",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-121.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-121.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-121",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-121.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-121.webp?260424",
  legality: "legal",
  level: 1,
  cost: 1,
  pilotName: "Katz Kobayashi",
  apBonus: 1,
  hpBonus: 0,
  effect:
    "【Action】Choose 1 friendly Base and 1 enemy Unit with 3 or less HP. Rest them.\n【Pilot】[Katz Kobayashi]",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["action"],
      },
      directives: [
        {
          action: {
            action: "rest",
            target: {
              owner: "friendly",
              cardType: "base",
              count: 1,
            },
          },
        },
        {
          action: {
            action: "rest",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "hp",
                  comparison: "lte",
                  value: 3,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Action】Choose 1 friendly Base and 1 enemy Unit with 3 or less HP. Rest them. 【Pilot】[Katz Kobayashi]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
