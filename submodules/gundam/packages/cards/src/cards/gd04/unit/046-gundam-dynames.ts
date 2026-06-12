import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04GundamDynames046: UnitCard = {
  cardNumber: "GD04-046",
  name: "Gundam Dynames",
  type: "unit",
  color: "red",
  traits: ["cb", "gn drive"],
  id: "GD04-046",
  externalId: "gundam:gd04-046",
  slug: "gundam-dynames-gd04-046",
  displayName: "Gundam Dynames",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-046",
  printings: [
    {
      id: "GD04-046",
      collectorNumber: "GD04-046",
      cardNumber: "GD04-046",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-046.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-046.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-046",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-046.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-046.webp?260424",
  legality: "legal",
  level: 5,
  cost: 4,
  ap: 4,
  hp: 4,
  linkCondition: "[Lockon Stratos]",
  effect:
    "【Deploy】You may rest this Unit. If you do, choose 1 enemy Unit that is Lv.3 or lower. Deal 2 damage to it.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      // KNOWN LIMITATION: `validateDeployTriggerTargets` validates the
      // counted dealDamage target before any `optionalAnswers` are read,
      // so deploying Dynames without preselecting an enemy Lv.3-or-lower
      // is rejected even when the controller wants to decline the
      // "may rest" branch. The current test exercises the path where the
      // controller opts in (and therefore must preselect a target);
      // declining isn't reachable until the validator becomes
      // optional-answer-aware.
      directives: [
        {
          action: {
            action: "rest",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
          optional: true,
        },
        {
          action: {
            action: "dealDamage",
            amount: 2,
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 3,
                },
              ],
              count: 1,
            },
          },
          dependsOnPrevious: true,
        },
      ],
      sourceText:
        "【Deploy】You may rest this Unit. If you do, choose 1 enemy Unit that is Lv.3 or lower. Deal 2 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
