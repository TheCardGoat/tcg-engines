import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03RedGundam039: UnitCard = {
  cardNumber: "GD03-039",
  name: "Red Gundam",
  type: "unit",
  color: "red",
  traits: ["clan"],
  id: "GD03-039",
  externalId: "gundam:gd03-039",
  slug: "red-gundam-gd03-039",
  displayName: "Red Gundam",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-039",
  printings: [
    {
      id: "GD03-039",
      collectorNumber: "GD03-039",
      cardNumber: "GD03-039",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-039.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-039.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-039_p1",
      collectorNumber: "GD03-039_p1",
      cardNumber: "GD03-039",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-039_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-039_p1.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD03-039",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-039.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-039.webp?260424",
  legality: "legal",
  level: 4,
  cost: 2,
  ap: 2,
  hp: 4,
  linkCondition: "(Clan) Trait",
  effect:
    "【Deploy】Choose 1 other active friendly (Clan) Unit. Rest it. If you do, choose 1 enemy Unit with 2 or less AP. Deal 2 damage to it.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "rest",
            target: {
              owner: "friendly",
              cardType: "unit",
              state: "active",
              excludeSource: true,
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "clan",
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
              attributeFilters: [
                {
                  attribute: "ap",
                  comparison: "lte",
                  value: 2,
                },
              ],
              count: 1,
            },
          },
          dependsOnPrevious: true,
        },
      ],
      sourceText:
        "【Deploy】Choose 1 other active friendly (Clan) Unit. Rest it. If you do, choose 1 enemy Unit with 2 or less AP. Deal 2 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
export const gd04RedGundam039 = gd03RedGundam039;
