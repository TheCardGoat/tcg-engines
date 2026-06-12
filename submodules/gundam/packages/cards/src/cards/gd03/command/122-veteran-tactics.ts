import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd03VeteranTactics122: CommandCard = {
  cardNumber: "GD03-122",
  name: "Veteran Tactics",
  type: "command",
  color: "white",
  traits: ["superpower bloc", "un"],
  id: "GD03-122",
  externalId: "gundam:gd03-122",
  slug: "veteran-tactics-gd03-122",
  displayName: "Veteran Tactics",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-122",
  printings: [
    {
      id: "GD03-122",
      collectorNumber: "GD03-122",
      cardNumber: "GD03-122",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-122.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-122.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-122",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-122.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-122.webp?260424",
  legality: "legal",
  level: 2,
  cost: 1,
  pilotName: "Sergei Smirnov",
  apBonus: 0,
  hpBonus: 1,
  effect:
    "【Action】Choose 1 enemy Unit that is Lv.3 or lower. Return it to its owner's hand.\n【Pilot】[Sergei Smirnov]",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["action"],
      },
      directives: [
        {
          action: {
            action: "returnToHand",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "level",
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
        "【Action】Choose 1 enemy Unit that is Lv.3 or lower. Return it to its owner's hand. 【Pilot】[Sergei Smirnov]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
