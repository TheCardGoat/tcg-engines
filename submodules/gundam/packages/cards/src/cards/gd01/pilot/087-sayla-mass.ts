import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd01SaylaMass087: PilotCard = {
  cardNumber: "GD01-087",
  name: "Sayla Mass",
  type: "pilot",
  color: "blue",
  traits: ["earth federation", "white base team", "newtype"],
  id: "GD01-087",
  externalId: "gundam:gd01-087",
  slug: "sayla-mass-gd01-087",
  displayName: "Sayla Mass",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-087",
  printings: [
    {
      id: "GD01-087",
      collectorNumber: "GD01-087",
      cardNumber: "GD01-087",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-087.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-087.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-087_p1",
      collectorNumber: "GD01-087_p1",
      cardNumber: "GD01-087",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-087_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-087_p1.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-087_p2",
      collectorNumber: "GD01-087_p2",
      cardNumber: "GD01-087",
      set: {
        code: "GD01",
        name: "Store Tournament Participant Pack 01",
        packageId: "616901",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-087_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-087_p2.webp?260424",
      productName: "Store Tournament Participant Pack 01",
    },
    {
      id: "GD01-087_p3",
      collectorNumber: "GD01-087_p3",
      cardNumber: "GD01-087",
      set: {
        code: "GD01",
        name: "Store Tournament Winner Pack 01",
        packageId: "616901",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-087_p3.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-087_p3.webp?260424",
      productName: "Store Tournament Winner Pack 01",
    },
  ],
  selectedPrintingId: "GD01-087",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-087.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-087.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.<br>While this Unit is blue, it gains &lt;Repair 1&gt;.<br>\n(At the end of your turn, this Unit recovers the specified number of HP.)<br>",
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
            type: "selfIsColor",
            color: "blue",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Repair",
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
        "While this Unit is blue, it gains <Repair 1>. (At the end of your turn, this Unit recovers the specified number of HP.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
