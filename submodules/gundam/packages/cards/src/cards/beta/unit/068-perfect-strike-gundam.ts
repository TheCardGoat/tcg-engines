import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const betaPerfectStrikeGundam068: UnitCard = {
  cardNumber: "GD01-068",
  name: "Perfect Strike Gundam",
  type: "unit",
  color: "white",
  traits: ["triple ship alliance"],
  id: "GD01-068_p1",
  externalId: "gundam:gd01-068_p1",
  slug: "perfect-strike-gundam-gd01-068-p1",
  displayName: "Perfect Strike Gundam",
  set: { code: "BETA", name: "Edition Beta", packageId: "616000" },
  printNumber: "GD01-068_p1",
  printings: [
    {
      id: "GD01-068",
      collectorNumber: "GD01-068",
      cardNumber: "GD01-068",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-068.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-068.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-068_p1",
      collectorNumber: "GD01-068_p1",
      cardNumber: "GD01-068",
      set: {
        code: "BETA",
        name: "Edition Beta",
        packageId: "616000",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/GD01-068_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-068_p1.webp?260424",
      productName: "Edition Beta",
    },
    {
      id: "GD01-068_p2",
      collectorNumber: "GD01-068_p2",
      cardNumber: "GD01-068",
      set: {
        code: "EVX05",
        name: "Premium Card Collection [EVX05]",
        packageId: "616701",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-068_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-068_p2.webp?260424",
      productName: "Premium Card Collection [EVX05]",
    },
  ],
  selectedPrintingId: "GD01-068_p1",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/GD01-068_p1.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-068_p1.webp?260424",
  legality: "legal",
  level: 5,
  cost: 3,
  ap: 4,
  hp: 4,
  effect:
    "&lt;Blocker&gt; (Rest this Unit to change the attack target to it.)<br>【Deploy】Choose 1 enemy Unit with 1 HP. Return it to its owner's hand.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "returnToHand",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Deploy】Choose 1 enemy Unit with 1 HP. Return it to its owner's hand.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Blocker" }],
  rarity: "rare",
};
