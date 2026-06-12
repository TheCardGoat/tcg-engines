import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04UnicornGundamAwakened066: UnitCard = {
  cardNumber: "GD04-066",
  name: "Unicorn Gundam (Awakened)",
  type: "unit",
  color: "white",
  traits: ["civilian"],
  id: "GD04-066",
  externalId: "gundam:gd04-066",
  slug: "unicorn-gundam-awakened-gd04-066",
  displayName: "Unicorn Gundam (Awakened)",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-066",
  printings: [
    {
      id: "GD04-066",
      collectorNumber: "GD04-066",
      cardNumber: "GD04-066",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-066.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-066.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
    {
      id: "GD04-066_p1",
      collectorNumber: "GD04-066_p1",
      cardNumber: "GD04-066",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-066_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-066_p1.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-066",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-066.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-066.webp?260424",
  legality: "legal",
  level: 7,
  cost: 5,
  ap: 4,
  hp: 6,
  linkCondition: "[Banagher Links]",
  effect:
    "<Suppression> (Damage to Shields by an attack is dealt to the first 2 cards simultaneously.)\nWhen you activate a Command's 【Main】/【Action】 effect, choose 1 enemy Unit. It gets AP-2 during this turn.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["onCommandEffectActivated"],
        conditions: [{ type: "eventPlayerIsSelf" }],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: -2,
            duration: "thisTurn",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "When you activate a Command's 【Main】/【Action】 effect, choose 1 enemy Unit. It gets AP-2 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Suppression" }],
  rarity: "legendRare",
};
