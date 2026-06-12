import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd01MQuve092: PilotCard = {
  cardNumber: "GD01-092",
  name: "M'Quve",
  type: "pilot",
  color: "green",
  traits: ["zeon"],
  id: "GD01-092",
  externalId: "gundam:gd01-092",
  slug: "m-quve-gd01-092",
  displayName: "M'Quve",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-092",
  printings: [
    {
      id: "GD01-092",
      collectorNumber: "GD01-092",
      cardNumber: "GD01-092",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-092.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-092.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-092",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-092.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-092.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.<br>While this Unit is (Zeon), it gains &lt;Breach 1&gt;.<br>\n(When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "addSelfToHand",
          },
        },
      ],
      sourceText: "【Burst】Add this card to your hand.",
    },
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "selfHasTrait",
            trait: "zeon",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Breach",
            keywordValue: 1,
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "While this Unit is (Zeon), it gains <Breach 1>. (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
