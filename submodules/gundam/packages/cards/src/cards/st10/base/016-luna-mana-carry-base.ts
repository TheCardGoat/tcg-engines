import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const st10LunaManaCarryBase016: BaseCard = {
  cardNumber: "ST10-016",
  name: "Luna Mana & Carry Base",
  type: "base",
  color: "blue",
  traits: ["g generation", "warship"],
  id: "ST10-016",
  canonicalId: "ST10-016",
  externalIds: { bandai: "gundam:st10-016" },
  slug: "luna-mana-carry-base-st10-016",
  displayName: "Luna Mana & Carry Base",
  rulesText:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand. Then, all friendly (G Generation) Units recover 1 HP.",
  set: { code: "ST10", name: "Generation Pulse [ST10]", packageId: "616010" },
  printNumber: "ST10-016",
  printings: [
    {
      id: "ST10-016",
      artId: "ST10-016",
      setCode: "ST10",
      collectorNumber: "ST10-016",
      cardNumber: "ST10-016",
      set: { code: "ST10", name: "Generation Pulse [ST10]", packageId: "616010" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/st10/ST10-016.webp",
      productName: "Generation Pulse [ST10]",
    },
    {
      id: "ST10-016-p1",
      artId: "ST10-016_p1",
      setCode: "ST10",
      collectorNumber: "ST10-016-p1",
      cardNumber: "ST10-016",
      set: { code: "ST10", name: "Generation Pulse [ST10]", packageId: "616010" },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/st10/ST10-016_p1.webp",
      productName: "Generation Pulse [ST10]",
    },
  ],
  selectedPrintingId: "ST10-016",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/st10/ST10-016.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 4,
  cost: 1,
  hp: 5,
  battlefieldZones: ["space", "earth"],
  effect:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand. Then, all friendly (G Generation) Units recover 1 HP.",
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
        {
          action: {
            action: "recoverHP",
            amount: 1,
            target: {
              owner: "friendly",
              cardType: "unit",
              count: "all",
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
        "【Deploy】Add 1 of your Shields to your hand. Then, all friendly (G Generation) Units recover 1 HP.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
