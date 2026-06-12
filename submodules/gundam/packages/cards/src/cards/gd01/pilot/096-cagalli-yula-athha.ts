import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd01CagalliYulaAthha096: PilotCard = {
  cardNumber: "GD01-096",
  name: "Cagalli Yula Athha",
  type: "pilot",
  color: "white",
  traits: ["orb"],
  id: "GD01-096",
  externalId: "gundam:gd01-096",
  slug: "cagalli-yula-athha-gd01-096",
  displayName: "Cagalli Yula Athha",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-096",
  printings: [
    {
      id: "GD01-096",
      collectorNumber: "GD01-096",
      cardNumber: "GD01-096",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-096.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-096.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-096_p1",
      collectorNumber: "GD01-096_p1",
      cardNumber: "GD01-096",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-096_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-096_p1.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-096_p2",
      collectorNumber: "GD01-096_p2",
      cardNumber: "GD01-096",
      set: {
        code: "GD01",
        name: "Championship Participation Pack 01",
        packageId: "616901",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-096_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-096_p2.webp?260424",
      productName: "Championship Participation Pack 01",
    },
  ],
  selectedPrintingId: "GD01-096",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-096.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-096.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.<br>While this Unit is white, it gains &lt;Blocker&gt;.<br>\n(Rest this Unit to change the attack target to it.)<br>",
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
            color: "white",
          },
        ],
      },
      directives: [
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
        "While this Unit is white, it gains <Blocker>. (Rest this Unit to change the attack target to it.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
