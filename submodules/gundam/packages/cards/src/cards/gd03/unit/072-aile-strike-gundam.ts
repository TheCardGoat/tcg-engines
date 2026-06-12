import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03AileStrikeGundam072: UnitCard = {
  cardNumber: "GD03-072",
  name: "Aile Strike Gundam",
  type: "unit",
  color: "white",
  traits: ["triple ship alliance"],
  id: "GD03-072",
  externalId: "gundam:gd03-072",
  slug: "aile-strike-gundam-gd03-072",
  displayName: "Aile Strike Gundam",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-072",
  printings: [
    {
      id: "GD03-072",
      collectorNumber: "GD03-072",
      cardNumber: "GD03-072",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-072.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-072.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-072_p1",
      collectorNumber: "GD03-072_p1",
      cardNumber: "GD03-072",
      set: {
        code: "GD03",
        name: "Store Tournament Participant Pack 03",
        packageId: "616901",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-072_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-072_p1.webp?260424",
      productName: "Store Tournament Participant Pack 03",
    },
    {
      id: "GD03-072_p2",
      collectorNumber: "GD03-072_p2",
      cardNumber: "GD03-072",
      set: {
        code: "GD03",
        name: "Store Tournament Winner Pack 03",
        packageId: "616901",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-072_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-072_p2.webp?260424",
      productName: "Store Tournament Winner Pack 03",
    },
  ],
  selectedPrintingId: "GD03-072",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-072.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-072.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 3,
  hp: 4,
  linkCondition: "[Mu La Flaga]",
  effect:
    "<Blocker> (Rest this Unit to change the attack target to it.)\n【Deploy】If you have another (Triple Ship Alliance) Unit in play, draw 1. Then, discard 1.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          condition: {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            excludeSelf: true,
            hasTrait: "triple ship alliance",
          },
          thenDirectives: [
            {
              action: {
                action: "draw",
                count: 1,
              },
            },
            {
              action: {
                action: "discard",
                count: 1,
              },
            },
          ],
        },
      ],
      sourceText:
        "【Deploy】If you have another (Triple Ship Alliance) Unit in play, draw 1. Then, discard 1.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Blocker" }],
  rarity: "rare",
};
