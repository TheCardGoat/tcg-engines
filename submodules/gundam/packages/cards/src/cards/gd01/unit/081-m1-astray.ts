import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01M1Astray081: UnitCard = {
  cardNumber: "GD01-081",
  name: "M1 Astray",
  type: "unit",
  color: "white",
  traits: ["triple ship alliance"],
  id: "GD01-081",
  externalId: "gundam:gd01-081",
  slug: "m1-astray-gd01-081",
  displayName: "M1 Astray",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-081",
  printings: [
    {
      id: "GD01-081",
      collectorNumber: "GD01-081",
      cardNumber: "GD01-081",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-081.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-081.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-081_p1",
      collectorNumber: "GD01-081_p1",
      cardNumber: "GD01-081",
      set: {
        code: "BETA",
        name: "Edition Beta",
        packageId: "616000",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/GD01-081_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-081_p1.webp?260424",
      productName: "Edition Beta",
    },
  ],
  selectedPrintingId: "GD01-081",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-081.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-081.webp?260424",
  legality: "legal",
  level: 2,
  cost: 2,
  ap: 2,
  hp: 2,
  effect:
    "While you have another (Triple Ship Alliance) Unit in play, this Unit gets AP+1 and &lt;Blocker&gt;.<br>\n (Rest this Unit to change the attack target to it.)<br>",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            excludeSelf: true,
            hasTrait: "triple ship alliance",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 1,
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
        {
          action: {
            action: "grantKeyword",
            keyword: "Blocker",
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "While you have another (Triple Ship Alliance) Unit in play, this Unit gets AP+1 and <Blocker>. (Rest this Unit to change the attack target to it.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
