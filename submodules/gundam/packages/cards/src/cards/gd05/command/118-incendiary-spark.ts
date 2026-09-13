import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd05IncendiarySpark118: CommandCard = {
  cardNumber: "GD05-118",
  name: "Incendiary Spark",
  type: "command",
  color: "white",
  traits: [],
  id: "GD05-118",
  canonicalId: "GD05-118",
  externalIds: { bandai: "gundam:gd05-118" },
  slug: "incendiary-spark-gd05-118",
  displayName: "Incendiary Spark",
  rulesText:
    "【Main】Choose 1 enemy Unit. It gets AP-2 during this turn. If you use an EX Resource to play this card, rest the enemy Unit.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-118",
  printings: [
    {
      id: "GD05-118",
      artId: "GD05-118",
      setCode: "GD05",
      collectorNumber: "GD05-118",
      cardNumber: "GD05-118",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-118.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-118",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-118.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam Wing: Endless Waltz",
  level: 3,
  cost: 1,
  effect:
    "【Main】Choose 1 enemy Unit. It gets AP-2 during this turn. If you use an EX Resource to play this card, rest the enemy Unit.",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main"],
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
        {
          action: {
            action: "rest",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
            requiresPaidExResources: true,
          },
          dependsOnPrevious: true,
          sharesTargetChoiceWithPrevious: true,
        },
      ],
      sourceText:
        "【Main】Choose 1 enemy Unit. It gets AP-2 during this turn. If you use an EX Resource to play this card, rest the enemy Unit.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
