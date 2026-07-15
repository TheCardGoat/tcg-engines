import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd01ExtremeHatred112: CommandCard = {
  cardNumber: "GD01-112",
  name: "Extreme Hatred",
  type: "command",
  color: "red",
  traits: ["zeon", "newtype"],
  id: "GD01-112",
  canonicalId: "GD01-112",
  externalIds: { bandai: "gundam:gd01-112" },
  slug: "extreme-hatred/gd01-112",
  displayName: "Extreme Hatred",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-112",
  printings: [
    {
      id: "GD01-112",
      artId: "GD01-112",
      setCode: "GD01",
      collectorNumber: "GD01-112",
      cardNumber: "GD01-112",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-112.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-112.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  reprints: ["GD01-112"],
  selectedPrintingId: "GD01-112",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-112.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-112.webp?260424",
  legality: "legal",
  level: 6,
  cost: 1,
  pilotName: "Loni Garvey",
  apBonus: 1,
  hpBonus: 0,
  effect:
    "【Main】Choose 2 of your active Units. Rest them. If you do, choose 1 enemy Unit. Deal 3 damage to it.<br>【Pilot】[Loni Garvey]<br>",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          action: {
            action: "resolveThenQueue",
            first: {
              action: "rest",
              target: {
                owner: "friendly",
                cardType: "unit",
                state: "active",
                count: 2,
              },
            },
            followUp: {
              type: "triggered",
              activation: { timing: [] },
              directives: [
                {
                  action: {
                    action: "dealDamage",
                    amount: 3,
                    target: {
                      owner: "opponent",
                      cardType: "unit",
                      count: 1,
                    },
                  },
                },
              ],
              sourceText: "Then, choose 1 enemy Unit. Deal 3 damage to it.",
            },
          },
        },
      ],
      sourceText:
        "【Main】Choose 2 of your active Units. Rest them. If you do, choose 1 enemy Unit. Deal 3 damage to it. 【Pilot】[Loni Garvey]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
