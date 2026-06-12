import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01DuelGundamAssaultShroud045: UnitCard = {
  cardNumber: "GD01-045",
  name: "Duel Gundam (Assault Shroud)",
  type: "unit",
  color: "red",
  traits: ["zaft"],
  id: "GD01-045",
  externalId: "gundam:gd01-045",
  slug: "duel-gundam-assault-shroud-gd01-045",
  displayName: "Duel Gundam (Assault Shroud)",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-045",
  printings: [
    {
      id: "GD01-045",
      collectorNumber: "GD01-045",
      cardNumber: "GD01-045",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-045.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-045.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-045_p1",
      collectorNumber: "GD01-045_p1",
      cardNumber: "GD01-045",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-045_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-045_p1.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-045",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-045.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-045.webp?260424",
  legality: "legal",
  level: 5,
  cost: 4,
  ap: 4,
  hp: 4,
  linkCondition: "[Yzak Jule]",
  effect:
    "【When Paired】Look at the top 3 cards of your deck. You may deploy 1 (ZAFT) Unit card that is Lv.4 or lower among them. Return the remaining cards randomly to the bottom of your deck.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenPaired"],
      },
      directives: [
        {
          action: {
            action: "lookAtTopDeck",
            count: 3,
            return: "chooseTop",
            tutorDestination: "battleArea",
            tutorFilter: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                { attribute: "trait", comparison: "includes", value: "zaft" },
                { attribute: "level", comparison: "lte", value: 4 },
              ],
            },
          },
        },
      ],
      sourceText:
        "【When Paired】Look at the top 3 cards of your deck. You may deploy 1 (ZAFT) Unit card that is Lv.4 or lower among them. Return the remaining cards randomly to the bottom of your deck.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
