import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01BigZam027: UnitCard = {
  cardNumber: "GD01-027",
  name: "Big Zam",
  type: "unit",
  color: "green",
  traits: ["zeon"],
  id: "GD01-027",
  externalId: "gundam:gd01-027",
  slug: "big-zam-gd01-027",
  displayName: "Big Zam",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-027",
  printings: [
    {
      id: "GD01-027",
      collectorNumber: "GD01-027",
      cardNumber: "GD01-027",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-027.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-027.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-027_p1",
      collectorNumber: "GD01-027_p1",
      cardNumber: "GD01-027",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-027_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-027_p1.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-027",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-027.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-027.webp?260424",
  legality: "legal",
  level: 7,
  cost: 5,
  ap: 5,
  hp: 6,
  effect:
    "&lt;Breach 4&gt; (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)<br>【Deploy】If there are 10 or more (Zeon)/(Neo Zeon) Unit cards in your trash, deal 4 damage to all Units with &lt;Blocker&gt;.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
        conditions: [
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "trash",
            cardType: "unit",
            comparison: "gte",
            count: 10,
            hasTrait: ["zeon", "neo zeon"],
          },
        ],
      },
      directives: [
        {
          action: {
            action: "dealDamageAll",
            amount: 4,
            target: {
              owner: "any",
              cardType: "unit",
              hasKeyword: "Blocker",
            },
          },
        },
      ],
      sourceText:
        "【Deploy】If there are 10 or more (Zeon)/(Neo Zeon) Unit cards in your trash, deal 4 damage to all Units with <Blocker>.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Breach", value: 4 }],
  rarity: "rare",
};
