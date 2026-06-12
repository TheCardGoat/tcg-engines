import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd03TowardsDestiny116: CommandCard = {
  cardNumber: "GD03-116",
  name: "Towards Destiny",
  type: "command",
  color: "purple",
  traits: [],
  id: "GD03-116",
  externalId: "gundam:gd03-116",
  slug: "towards-destiny-gd03-116",
  displayName: "Towards Destiny",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-116",
  printings: [
    {
      id: "GD03-116",
      collectorNumber: "GD03-116",
      cardNumber: "GD03-116",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-116.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-116.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-116",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-116.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-116.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  effect:
    "【Main】/【Action】Choose 1 friendly (Vagan) Unit and 1 enemy Unit. Deal 2 damage to them.",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 2,
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "vagan",
                },
              ],
              count: 1,
            },
          },
        },
        {
          action: {
            action: "dealDamage",
            amount: 2,
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Main】/【Action】Choose 1 friendly (Vagan) Unit and 1 enemy Unit. Deal 2 damage to them.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
