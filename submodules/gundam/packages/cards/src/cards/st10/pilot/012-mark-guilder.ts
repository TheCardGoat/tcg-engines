import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const st10MarkGuilder012: PilotCard = {
  cardNumber: "ST10-012",
  name: "Mark Guilder",
  type: "pilot",
  color: "white",
  traits: ["g generation", "support"],
  id: "ST10-012",
  canonicalId: "ST10-012",
  externalIds: { bandai: "gundam:st10-012" },
  slug: "mark-guilder-st10-012",
  displayName: "Mark Guilder",
  rulesText:
    "【Burst】Add this card to your hand.\n【When Paired】Choose 1 enemy Unit that is Lv.5 or lower. It gets AP-2 during this turn.",
  set: { code: "ST10", name: "Generation Pulse [ST10]", packageId: "616010" },
  printNumber: "ST10-012",
  printings: [
    {
      id: "ST10-012",
      artId: "ST10-012",
      setCode: "ST10",
      collectorNumber: "ST10-012",
      cardNumber: "ST10-012",
      set: { code: "ST10", name: "Generation Pulse [ST10]", packageId: "616010" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/st10/ST10-012.webp",
      productName: "Generation Pulse [ST10]",
    },
    {
      id: "ST10-012-p1",
      artId: "ST10-012_p1",
      setCode: "ST10",
      collectorNumber: "ST10-012-p1",
      cardNumber: "ST10-012",
      set: { code: "ST10", name: "Generation Pulse [ST10]", packageId: "616010" },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/st10/ST10-012_p1.webp",
      productName: "Generation Pulse [ST10]",
    },
  ],
  selectedPrintingId: "ST10-012",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/st10/ST10-012.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 4,
  cost: 1,
  apBonus: 2,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\n【When Paired】Choose 1 enemy Unit that is Lv.5 or lower. It gets AP-2 during this turn.",
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
        timing: ["whenPaired"],
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
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 5,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【When Paired】Choose 1 enemy Unit that is Lv.5 or lower. It gets AP-2 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
