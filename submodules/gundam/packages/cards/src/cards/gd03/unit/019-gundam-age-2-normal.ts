import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03GundamAge2Normal019: UnitCard = {
  cardNumber: "GD03-019",
  name: "Gundam AGE-2 Normal",
  type: "unit",
  color: "green",
  traits: ["earth federation", "age system"],
  id: "GD03-019",
  externalId: "gundam:gd03-019",
  slug: "gundam-age-2-normal-gd03-019",
  displayName: "Gundam AGE-2 Normal",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-019",
  printings: [
    {
      id: "GD03-019",
      collectorNumber: "GD03-019",
      cardNumber: "GD03-019",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-019.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-019.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-019_p1",
      collectorNumber: "GD03-019_p1",
      cardNumber: "GD03-019",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-019_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-019_p1.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-019",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-019.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-019.webp?260424",
  legality: "legal",
  level: 5,
  cost: 4,
  ap: 4,
  hp: 4,
  linkCondition: "[Asemu Asuno]",
  effect:
    "【During Pair】Enemy Units choose this rested Unit as their attack target if possible when attacking.\n【When Linked】Place 1 EX Resource.",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [{ type: "duringPair" }, { type: "selfIsRested" }],
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
        "【During Pair】Enemy Units choose this rested Unit as their attack target if possible when attacking.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["whenLinked"],
      },
      directives: [
        {
          action: {
            action: "placeExResource",
            state: "active",
          },
        },
      ],
      sourceText: "【When Linked】Place 1 EX Resource.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
