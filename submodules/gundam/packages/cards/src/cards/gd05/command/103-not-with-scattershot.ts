import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd05NotWithScattershot103: CommandCard = {
  cardNumber: "GD05-103",
  name: "Not with Scattershot!",
  type: "command",
  color: "blue",
  traits: ["titans"],
  id: "GD05-103",
  canonicalId: "GD05-103",
  externalIds: { bandai: "gundam:gd05-103" },
  slug: "not-with-scattershot-gd05-103",
  displayName: "Not with Scattershot!",
  rulesText:
    "【Main】/【Action】Choose 1 friendly Unit. It recovers 1 HP and gets AP+2 during this turn.\n【Pilot】[Buran Blutarch]",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-103",
  printings: [
    {
      id: "GD05-103",
      artId: "GD05-103",
      setCode: "GD05",
      collectorNumber: "GD05-103",
      cardNumber: "GD05-103",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-103.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-103",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-103.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Z Gundam",
  level: 4,
  cost: 1,
  pilotName: "Buran Blutarch",
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Main】/【Action】Choose 1 friendly Unit. It recovers 1 HP and gets AP+2 during this turn.\n【Pilot】[Buran Blutarch]",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
      },
      directives: [
        {
          action: {
            action: "recoverHP",
            amount: 1,
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
            },
          },
        },
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
      sourceText:
        "【Main】/【Action】Choose 1 friendly Unit. It recovers 1 HP and gets AP+2 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
