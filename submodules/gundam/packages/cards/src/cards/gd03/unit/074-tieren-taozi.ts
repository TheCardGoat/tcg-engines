import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03TierenTaozi074: UnitCard = {
  cardNumber: "GD03-074",
  name: "Tieren Taozi",
  type: "unit",
  color: "white",
  traits: ["superpower bloc"],
  id: "GD03-074",
  externalId: "gundam:gd03-074",
  slug: "tieren-taozi-gd03-074",
  displayName: "Tieren Taozi",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-074",
  printings: [
    {
      id: "GD03-074",
      collectorNumber: "GD03-074",
      cardNumber: "GD03-074",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-074.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-074.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-074",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-074.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-074.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 3,
  hp: 1,
  linkCondition: "(Super Soldier) Trait",
  effect:
    "【During Pair】While you have another (Superpower Bloc) Unit in play, enemy Units choose this rested Unit as their attack target if possible when attacking.",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          { type: "duringPair" },
          { type: "selfIsRested" },
          {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            hasTrait: "superpower bloc",
            excludeSelf: true,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "forceAttackTarget",
            unit: { owner: "opponent", cardType: "unit", count: "all" },
            attackTarget: { owner: "self", cardType: "unit", state: "rested" },
            duration: "permanent",
          },
        },
      ],
      sourceText:
        "【During Pair】While you have another (Superpower Bloc) Unit in play, enemy Units choose this rested Unit as their attack target if possible when attacking.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
