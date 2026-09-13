import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd05DarknessFinger110: CommandCard = {
  cardNumber: "GD05-110",
  name: "Darkness Finger",
  type: "command",
  color: "red",
  traits: ["special move"],
  id: "GD05-110",
  canonicalId: "GD05-110",
  externalIds: { bandai: "gundam:gd05-110" },
  slug: "darkness-finger-gd05-110",
  displayName: "Darkness Finger",
  rulesText:
    '【Burst】Activate this card\'s 【Main】.\n【Main】/【Action】Choose 1 enemy Unit. Deal 2 damage to it. Then, if you have a Unit with "Master Gundam" in its card name in play, draw 1.',
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-110",
  printings: [
    {
      id: "GD05-110",
      artId: "GD05-110",
      setCode: "GD05",
      collectorNumber: "GD05-110",
      cardNumber: "GD05-110",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-110.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-110",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-110.webp",
  legality: "legal",
  sourceTitle: "Mobile Fighter G Gundam",
  level: 4,
  cost: 1,
  effect:
    '【Burst】Activate this card\'s 【Main】.\n【Main】/【Action】Choose 1 enemy Unit. Deal 2 damage to it. Then, if you have a Unit with "Master Gundam" in its card name in play, draw 1.',
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "activateTiming",
            timing: "main",
          },
        },
      ],
      sourceText: "【Burst】Activate this card's 【Main】.",
    },
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 2,
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
        },
        {
          condition: {
            type: "cardInZone",
            owner: "friendly",
            zone: "battleArea",
            cardType: "unit",
            comparison: "gte",
            count: 1,
            hasName: "Master Gundam",
          },
          thenDirectives: [{ action: { action: "draw", count: 1 } }],
        },
      ],
      sourceText:
        '【Main】/【Action】Choose 1 enemy Unit. Deal 2 damage to it. Then, if you have a Unit with "Master Gundam" in its card name in play, draw 1.',
    },
  ] satisfies CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
