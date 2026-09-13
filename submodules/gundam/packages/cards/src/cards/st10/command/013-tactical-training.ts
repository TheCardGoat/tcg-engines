import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const st10TacticalTraining013: CommandCard = {
  cardNumber: "ST10-013",
  name: "Tactical Training",
  type: "command",
  color: "blue",
  traits: [],
  id: "ST10-013",
  canonicalId: "ST10-013",
  externalIds: { bandai: "gundam:st10-013" },
  slug: "tactical-training-st10-013",
  displayName: "Tactical Training",
  rulesText:
    "【Burst】Add this card to your hand.\n【Main】/【Action】Choose 1 (G Generation) Unit that is Lv.5 or higher. It recovers 2 HP and gets AP+2 during this turn.",
  set: { code: "ST10", name: "Generation Pulse [ST10]", packageId: "616010" },
  printNumber: "ST10-013",
  printings: [
    {
      id: "ST10-013",
      artId: "ST10-013",
      setCode: "ST10",
      collectorNumber: "ST10-013",
      cardNumber: "ST10-013",
      set: { code: "ST10", name: "Generation Pulse [ST10]", packageId: "616010" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/st10/ST10-013.webp",
      productName: "Generation Pulse [ST10]",
    },
    {
      id: "ST10-013-p1",
      artId: "ST10-013_p1",
      setCode: "ST10",
      collectorNumber: "ST10-013-p1",
      cardNumber: "ST10-013",
      set: { code: "ST10", name: "Generation Pulse [ST10]", packageId: "616010" },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/st10/ST10-013_p1.webp",
      productName: "Generation Pulse [ST10]",
    },
  ],
  selectedPrintingId: "ST10-013",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/st10/ST10-013.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 3,
  cost: 1,
  effect:
    "【Burst】Add this card to your hand.\n【Main】/【Action】Choose 1 (G Generation) Unit that is Lv.5 or higher. It recovers 2 HP and gets AP+2 during this turn.",
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
      type: "command",
      activation: {
        timing: ["main", "action"],
      },
      directives: [
        {
          action: {
            action: "recoverHP",
            amount: 2,
            target: {
              owner: "any",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "gte",
                  value: 5,
                },
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "g generation",
                },
              ],
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
              owner: "any",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "gte",
                  value: 5,
                },
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "g generation",
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Main】/【Action】Choose 1 (G Generation) Unit that is Lv.5 or higher. It recovers 2 HP and gets AP+2 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
