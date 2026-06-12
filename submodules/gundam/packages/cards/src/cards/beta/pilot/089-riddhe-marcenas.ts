import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const betaRiddheMarcenas089: PilotCard = {
  cardNumber: "GD01-089",
  name: "Riddhe Marcenas",
  type: "pilot",
  color: "blue",
  traits: ["earth federation"],
  id: "GD01-089_p1",
  externalId: "gundam:gd01-089_p1",
  slug: "riddhe-marcenas-gd01-089-p1",
  displayName: "Riddhe Marcenas",
  set: { code: "BETA", name: "Edition Beta", packageId: "616000" },
  printNumber: "GD01-089_p1",
  printings: [
    {
      id: "GD01-089",
      collectorNumber: "GD01-089",
      cardNumber: "GD01-089",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-089.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-089.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-089_p1",
      collectorNumber: "GD01-089_p1",
      cardNumber: "GD01-089",
      set: {
        code: "BETA",
        name: "Edition Beta",
        packageId: "616000",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/GD01-089_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-089_p1.webp?260424",
      productName: "Edition Beta",
    },
  ],
  selectedPrintingId: "GD01-089_p1",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/GD01-089_p1.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-089_p1.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.<br>If this Unit has &lt;Repair&gt;, it gets AP+1.<br>",
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
          condition: {
            type: "selfHasKeyword",
            keyword: "Repair",
          },
          thenDirectives: [
            {
              action: {
                action: "statModifier",
                stat: "ap",
                amount: 1,
                duration: "permanent",
                target: {
                  owner: "self",
                },
              },
            },
          ],
        },
      ],
      sourceText: "【Burst】Add this card to your hand. If this Unit has <Repair>, it gets AP+1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
