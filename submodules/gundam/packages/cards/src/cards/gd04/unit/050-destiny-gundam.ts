import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04DestinyGundam050: UnitCard = {
  cardNumber: "GD04-050",
  name: "Destiny Gundam",
  type: "unit",
  color: "purple",
  traits: ["zaft", "minerva squad"],
  id: "GD04-050",
  externalId: "gundam:gd04-050",
  slug: "destiny-gundam-gd04-050",
  displayName: "Destiny Gundam",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-050",
  printings: [
    {
      id: "GD04-050",
      collectorNumber: "GD04-050",
      cardNumber: "GD04-050",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-050.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-050.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
    {
      id: "GD04-050_p1",
      collectorNumber: "GD04-050_p1",
      cardNumber: "GD04-050",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-050_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-050_p1.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
    {
      id: "GD04-050_p2",
      collectorNumber: "GD04-050_p2",
      cardNumber: "GD04-050",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-050_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-050_p2.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-050",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-050.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-050.webp?260424",
  legality: "legal",
  level: 7,
  cost: 5,
  ap: 5,
  hp: 5,
  linkCondition: "[Shinn Asuka]",
  effect:
    "<High-Maneuver> (This Unit can't be blocked.)\n【During Pair】【Attack】You may choose 1 (Minerva Squad) Unit card from your trash. Pay its cost to deploy it.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
        conditions: [{ type: "duringPair" }],
      },
      directives: [
        {
          optional: true,
          action: {
            action: "deployFromTrash",
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
                  value: "minerva squad",
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "【During Pair】【Attack】You may choose 1 (Minerva Squad) Unit card from your trash. Pay its cost to deploy it.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "HighManeuver" }],
  rarity: "legendRare",
};
