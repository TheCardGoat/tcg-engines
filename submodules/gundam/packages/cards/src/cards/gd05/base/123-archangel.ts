import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd05Archangel123: BaseCard = {
  cardNumber: "GD05-123",
  name: "Archangel",
  type: "base",
  color: "blue",
  traits: ["orb", "warship"],
  id: "GD05-123",
  canonicalId: "GD05-123",
  externalIds: { bandai: "gundam:gd05-123" },
  slug: "archangel-gd05-123",
  displayName: "Archangel",
  rulesText:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\nDuring your opponent's turn, friendly (Orb) Units can't receive 2 or less enemy effect damage.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-123",
  printings: [
    {
      id: "GD05-123",
      artId: "GD05-123",
      setCode: "GD05",
      collectorNumber: "GD05-123",
      cardNumber: "GD05-123",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-123.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-123",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-123.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam SEED Destiny",
  level: 2,
  cost: 1,
  hp: 5,
  battlefieldZones: ["space", "earth"],
  effect:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\nDuring your opponent's turn, friendly (Orb) Units can't receive 2 or less enemy effect damage.",
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
      type: "constant",
      activation: {
        conditions: [
          {
            type: "isTurn",
            whose: "opponent",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "preventDamage",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: "all",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "orb",
                },
              ],
            },
            damageType: "effect",
            source: "enemy",
            maxDamageAmount: 2,
            duration: "permanent",
          },
        },
      ],
      sourceText:
        "During your opponent's turn, friendly (Orb) Units can't receive 2 or less enemy effect damage.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
