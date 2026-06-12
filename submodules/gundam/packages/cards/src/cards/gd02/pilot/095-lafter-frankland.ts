import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd02LafterFrankland095: PilotCard = {
  cardNumber: "GD02-095",
  name: "Lafter Frankland",
  type: "pilot",
  color: "purple",
  traits: ["teiwaz"],
  id: "GD02-095",
  externalId: "gundam:gd02-095",
  slug: "lafter-frankland-gd02-095",
  displayName: "Lafter Frankland",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-095",
  printings: [
    {
      id: "GD02-095",
      collectorNumber: "GD02-095",
      cardNumber: "GD02-095",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-095.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-095.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-095",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-095.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-095.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 2,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.<br>【Attack】If this Unit is damaged and Lv.5 or lower, it gains &lt;High-Maneuver&gt; during this battle.<br>\n(This Unit can't be blocked.)<br>",
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
      type: "triggered",
      activation: {
        timing: ["attack"],
      },
      directives: [
        {
          condition: {
            type: "selfIsDamaged",
          },
          thenDirectives: [
            {
              action: {
                action: "grantKeyword",
                keyword: "HighManeuver",
                duration: "thisBattle",
                target: {
                  owner: "self",
                  cardType: "unit",
                },
              },
            },
          ],
        },
      ],
      sourceText:
        "【Attack】If this Unit is damaged and Lv.5 or lower, it gains <High-Maneuver> during this battle. (This Unit can't be blocked.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
