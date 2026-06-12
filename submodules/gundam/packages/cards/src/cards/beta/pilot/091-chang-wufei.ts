import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const betaChangWufei091: PilotCard = {
  cardNumber: "GD01-091",
  name: "Chang Wufei",
  type: "pilot",
  color: "green",
  traits: ["operation meteor"],
  id: "GD01-091_p1",
  externalId: "gundam:gd01-091_p1",
  slug: "chang-wufei-gd01-091-p1",
  displayName: "Chang Wufei",
  set: { code: "BETA", name: "Edition Beta", packageId: "616000" },
  printNumber: "GD01-091_p1",
  printings: [
    {
      id: "GD01-091",
      collectorNumber: "GD01-091",
      cardNumber: "GD01-091",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-091.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-091.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-091_p1",
      collectorNumber: "GD01-091_p1",
      cardNumber: "GD01-091",
      set: {
        code: "BETA",
        name: "Edition Beta",
        packageId: "616000",
      },
      rarity: "uncommon",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/GD01-091_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-091_p1.webp?260424",
      productName: "Edition Beta",
    },
  ],
  selectedPrintingId: "GD01-091_p1",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/GD01-091_p1.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-091_p1.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 2,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.<br>During your turn, if this Unit has &lt;Breach&gt;, it can't receive battle damage from enemy Units with 3 or less AP.<br>",
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
        {
          action: {
            action: "preventDamage",
            target: {
              owner: "self",
            },
            damageType: "battle",
            unitFilter: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [{ attribute: "ap", comparison: "lte", value: 3 }],
            },
          },
        },
      ],
      sourceText:
        "【Burst】Add this card to your hand. During your turn, if this Unit has <Breach>, it can't receive battle damage from enemy Units with 3 or less AP.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
