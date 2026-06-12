import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03DuelGundamAssaultShroud042: UnitCard = {
  cardNumber: "GD03-042",
  name: "Duel Gundam (Assault Shroud)",
  type: "unit",
  color: "red",
  traits: ["zaft"],
  id: "GD03-042",
  externalId: "gundam:gd03-042",
  slug: "duel-gundam-assault-shroud-gd03-042",
  displayName: "Duel Gundam (Assault Shroud)",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-042",
  printings: [
    {
      id: "GD03-042",
      collectorNumber: "GD03-042",
      cardNumber: "GD03-042",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-042.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-042.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-042",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-042.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-042.webp?260424",
  legality: "legal",
  level: 5,
  cost: 3,
  ap: 3,
  hp: 4,
  linkCondition: "[Yzak Jule]",
  effect:
    "While this Unit has 5 or more AP, it may choose an active enemy Unit that is Lv.5 or lower as its attack target.",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "selfStat",
            stat: "ap",
            comparison: "gte",
            value: 5,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "chooseAttackTarget",
            unit: {
              owner: "self",
              cardType: "unit",
            },
            attackTarget: {
              owner: "opponent",
              cardType: "unit",
              state: "active",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
            duration: "permanent",
          },
        },
      ],
      sourceText:
        "While this Unit has 5 or more AP, it may choose an active enemy Unit that is Lv.5 or lower as its attack target.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
