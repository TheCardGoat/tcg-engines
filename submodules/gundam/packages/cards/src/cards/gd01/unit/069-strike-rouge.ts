import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01StrikeRouge069: UnitCard = {
  cardNumber: "GD01-069",
  name: "Strike Rouge",
  type: "unit",
  color: "white",
  traits: ["triple ship alliance"],
  id: "GD01-069",
  externalId: "gundam:gd01-069",
  slug: "strike-rouge-gd01-069",
  displayName: "Strike Rouge",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-069",
  printings: [
    {
      id: "GD01-069",
      collectorNumber: "GD01-069",
      cardNumber: "GD01-069",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-069.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-069.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-069_p1",
      collectorNumber: "GD01-069_p1",
      cardNumber: "GD01-069",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-069_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-069_p1.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-069",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-069.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-069.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 3,
  hp: 2,
  effect:
    "【Activate･Main】【Once per Turn】①：Choose 1 of your rested white Units with &lt;Blocker&gt;. Set it as active. It can't attack during this turn.<br>",
  effects: [
    {
      type: "activated",
      activation: {
        timing: ["activate:main"],
        restrictions: [{ type: "oncePerTurn" }],
      },
      cost: {
        payResources: 1,
      },
      directives: [
        {
          action: {
            action: "setActive",
            target: {
              owner: "friendly",
              cardType: "unit",
              state: "rested",
              hasKeyword: "Blocker",
              count: 1,
            },
          },
        },
        {
          action: {
            action: "cantAttack",
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
              hasKeyword: "Blocker",
              attributeFilters: [{ attribute: "color", comparison: "eq", value: "white" }],
            },
          },
        },
      ],
      sourceText:
        "【Activate·Main】【Once per Turn】①：Choose 1 of your rested white Units with <Blocker>. Set it as active. It can't attack during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
