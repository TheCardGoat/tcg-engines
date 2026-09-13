import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const st10UnlockingTheDevelopmentDiagram014: CommandCard = {
  cardNumber: "ST10-014",
  name: "Unlocking the Development Diagram",
  type: "command",
  color: "blue",
  traits: [],
  id: "ST10-014",
  canonicalId: "ST10-014",
  externalIds: { bandai: "gundam:st10-014" },
  slug: "unlocking-the-development-diagram-st10-014",
  displayName: "Unlocking the Development Diagram",
  rulesText:
    "When playing this card from your hand, you may discard 1 (G Generation) Unit card. If you do, play this card as if it has 2 Lv. and cost.\n【Main】Draw 2.",
  set: { code: "ST10", name: "Generation Pulse [ST10]", packageId: "616010" },
  printNumber: "ST10-014",
  printings: [
    {
      id: "ST10-014",
      artId: "ST10-014",
      setCode: "ST10",
      collectorNumber: "ST10-014",
      cardNumber: "ST10-014",
      set: { code: "ST10", name: "Generation Pulse [ST10]", packageId: "616010" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/st10/ST10-014.webp",
      productName: "Generation Pulse [ST10]",
    },
    {
      id: "ST10-014-p1",
      artId: "ST10-014_p1",
      setCode: "ST10",
      collectorNumber: "ST10-014-p1",
      cardNumber: "ST10-014",
      set: { code: "ST10", name: "Generation Pulse [ST10]", packageId: "616010" },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/st10/ST10-014_p1.webp",
      productName: "Generation Pulse [ST10]",
    },
  ],
  selectedPrintingId: "ST10-014",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/st10/ST10-014.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 4,
  cost: 4,
  effect:
    "When playing this card from your hand, you may discard 1 (G Generation) Unit card. If you do, play this card as if it has 2 Lv. and cost.\n【Main】Draw 2.",
  effects: [
    {
      type: "substitution",
      activation: {},
      directives: [
        {
          action: {
            action: "playCostSubstitution",
            level: 2,
            cost: 2,
            discardTarget: {
              owner: "friendly",
              zone: "hand",
              cardType: "unit",
              count: 1,
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "g generation",
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "When playing this card from your hand, you may discard 1 (G Generation) Unit card. If you do, play this card as if it has 2 Lv. and cost.",
    },
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          action: {
            action: "draw",
            count: 2,
          },
        },
      ],
      sourceText: "【Main】Draw 2.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
