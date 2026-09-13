import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd05GundamFight128: BaseCard = {
  cardNumber: "GD05-128",
  name: "Gundam Fight",
  type: "base",
  color: "red",
  traits: ["stronghold"],
  id: "GD05-128",
  canonicalId: "GD05-128",
  externalIds: { bandai: "gundam:gd05-128" },
  slug: "gundam-fight-gd05-128",
  displayName: "Gundam Fight",
  rulesText:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\n【Activate･Main】Rest this Base：If a friendly (MF) Link Unit is in play, choose 1 friendly Unit. It gets AP+2 during this turn.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-128",
  printings: [
    {
      id: "GD05-128",
      artId: "GD05-128",
      setCode: "GD05",
      collectorNumber: "GD05-128",
      cardNumber: "GD05-128",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-128.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-128",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-128.webp",
  legality: "legal",
  sourceTitle: "Mobile Fighter G Gundam",
  level: 3,
  cost: 1,
  hp: 5,
  battlefieldZones: ["earth"],
  effect:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\n【Activate･Main】Rest this Base：If a friendly (MF) Link Unit is in play, choose 1 friendly Unit. It gets AP+2 during this turn.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "deploySelf",
          },
        },
      ],
      sourceText: "【Burst】Deploy this card.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "addShieldToHand",
            count: 1,
          },
        },
      ],
      sourceText: "【Deploy】Add 1 of your Shields to your hand.",
    },
    {
      type: "activated",
      activation: {
        timing: ["activate:main"],
      },
      cost: {
        restSelf: true,
      },
      directives: [
        {
          condition: {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            hasTrait: "mf",
            isLinkUnit: true,
          },
          thenDirectives: [
            {
              action: {
                action: "statModifier",
                stat: "ap",
                amount: 2,
                duration: "thisTurn",
                target: {
                  owner: "friendly",
                  cardType: "unit",
                  count: 1,
                },
              },
            },
          ],
        },
      ],
      sourceText:
        "【Activate·Main】Rest this Base：If a friendly (MF) Link Unit is in play, choose 1 friendly Unit. It gets AP+2 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
